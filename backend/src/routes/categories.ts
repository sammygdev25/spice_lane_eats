import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, requireStaff, AuthRequest } from '../middleware/auth';

const router = Router();

const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  displayOrder: z.number().int().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  displayOrder: z.number().int().optional(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// GET /api/categories/
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    console.error('[Categories] Error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:id
router.get('/:id', async (req: Request, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const category = await prisma.category.findUnique({
      where: { id: parsedParams.data.id },
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('[Categories] Error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// POST /api/categories/ (staff only)
router.post('/', authMiddleware, requireStaff, async (req: AuthRequest, res: Response) => {
  const parsed = createCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        displayOrder: parsed.data.displayOrder ?? 0,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('[Categories] Error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /api/categories/:id (staff only)
router.put('/:id', authMiddleware, requireStaff, async (req: AuthRequest, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  const parsed = updateCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const existing = await prisma.category.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const category = await prisma.category.update({
      where: { id: parsedParams.data.id },
      data: parsed.data,
    });
    res.json(category);
  } catch (error) {
    console.error('[Categories] Error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id (staff only)
router.delete('/:id', authMiddleware, requireStaff, async (req: AuthRequest, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const existing = await prisma.category.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await prisma.category.delete({ where: { id: parsedParams.data.id } });
    res.status(204).send();
  } catch (error) {
    console.error('[Categories] Error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;