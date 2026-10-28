import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest, requireStaff } from '../middleware/auth';

const router = Router();

const createMenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(''),
  price: z.number().nonnegative(),
  categoryId: z.number().int().positive(),
  imageUrl: z.string().optional().default(''),
  isAvailable: z.boolean().optional().default(true),
});

const updateMenuItemSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  categoryId: z.number().int().positive().optional(),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

const querySchema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),
  available: z.enum(['true', 'false']).optional(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// GET /api/menu-items/
router.get('/', async (req: Request, res: Response) => {
  const parsedQuery = querySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({ error: 'Invalid query', code: 'validation_error', issues: parsedQuery.error.issues });
  }
  try {
    const { categoryId, available } = parsedQuery.data;
    const where: Record<string, unknown> = {};
    if (categoryId !== undefined) {
      where.categoryId = categoryId;
    }
    if (available !== undefined) {
      where.isAvailable = available === 'true';
    }
    const items = await prisma.menuItem.findMany({
      where,
      include: { category: true },
      orderBy: [{ category: { displayOrder: 'asc' } }, { name: 'asc' }],
    });
    res.json(
      items.map((item) => ({
        ...item,
        price: Number(item.price),
      }))
    );
  } catch (error) {
    console.error('[MenuItems] Error:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// GET /api/menu-items/:id
router.get('/:id', async (req: Request, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: parsedParams.data.id },
      include: { category: true },
    });
    if (!item) {
      return res.status(404).json({ error: 'MenuItem not found' });
    }
    res.json({ ...item, price: Number(item.price) });
  } catch (error) {
    console.error('[MenuItems] Error:', error);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// POST /api/menu-items/ (staff only)
router.post('/', authMiddleware, requireStaff, async (req: AuthRequest, res: Response) => {
  const parsed = createMenuItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
    if (!category) {
      return res.status(400).json({ error: 'Invalid categoryId' });
    }
    const item = await prisma.menuItem.create({
      data: { ...parsed.data },
      include: { category: true },
    });
    res.status(201).json({ ...item, price: Number(item.price) });
  } catch (error) {
    console.error('[MenuItems] Error:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// PATCH /api/menu-items/:id (staff only)
router.patch('/:id', authMiddleware, requireStaff, async (req: AuthRequest, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  const parsed = updateMenuItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const existing = await prisma.menuItem.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'MenuItem not found' });
    }
    if (parsed.data.categoryId !== undefined) {
      const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
      if (!category) {
        return res.status(400).json({ error: 'Invalid categoryId' });
      }
    }
    const item = await prisma.menuItem.update({
      where: { id: parsedParams.data.id },
      data: { ...parsed.data },
      include: { category: true },
    });
    res.json({ ...item, price: Number(item.price) });
  } catch (error) {
    console.error('[MenuItems] Error:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// DELETE /api/menu-items/:id (staff only)
router.delete('/:id', authMiddleware, requireStaff, async (req: AuthRequest, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const existing = await prisma.menuItem.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'MenuItem not found' });
    }
    await prisma.menuItem.delete({ where: { id: parsedParams.data.id } });
    res.status(204).send();
  } catch (error) {
    console.error('[MenuItems] Error:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

export default router;