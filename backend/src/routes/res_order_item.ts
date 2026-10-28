import { Router, Request, Response, RequestHandler } from 'express';
import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { logger } from '../lib/logger';


// Generated resource router for OrderItem (no domain route file served it).
const router = Router();
const guard: RequestHandler[] = [authMiddleware as unknown as RequestHandler];

function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

const listQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
async function sendList(req: Request, res: Response, where: Prisma.OrderItemWhereInput): Promise<void> {
  const q = listQuery.safeParse(req.query);
  if (!q.success) { res.status(400).json({ error: 'Invalid query', code: 'validation_error', issues: q.error.issues }); return; }
  if (q.data.page === undefined) { res.json(await prisma.orderItem.findMany({ where, orderBy: { id: 'asc' } })); return; }
  const skip = (q.data.page - 1) * q.data.pageSize;
  const [items, total] = await Promise.all([
    prisma.orderItem.findMany({ where, orderBy: { id: 'asc' }, skip, take: q.data.pageSize }),
    prisma.orderItem.count({ where }),
  ]);
  res.json({ items, total, page: q.data.page, pageSize: q.data.pageSize });
}

async function ownedIds(req: Request): Promise<number[]> {
  const userId = (req as Request & { userId?: number }).userId;
  if (userId == null) { return []; }
  const rows = await prisma.order.findMany({ where: { userId }, select: { id: true } });
  return rows.map((r) => r.id);
}

router.get('/', ...guard, async (req: Request, res: Response) => {
  try {
    const ids = await ownedIds(req);
    await sendList(req, res, { orderId: { in: ids } });
  } catch (err) { logger.warn({ err }, 'OrderItem read failed'); res.status(500).json({ error: 'Server error', code: 'internal_error' }); }
});

router.get('/:id', ...guard, async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) { res.status(400).json({ error: 'Invalid id' }); return; }
  try {
    const item = await prisma.orderItem.findUnique({ where: { id } });
    if (!item || !(await ownedIds(req)).includes(item.orderId)) { res.status(404).json({ error: 'OrderItem not found' }); return; }
    res.json(item);
  } catch (err) { logger.warn({ err }, 'OrderItem read failed'); res.status(500).json({ error: 'Server error', code: 'internal_error' }); }
});

const readOnly = (_req: Request, res: Response): void => {
  res.status(405).json({ error: 'OrderItem rows are placed and changed through the order route', code: 'read_only' });
};
router.post('/', ...guard, readOnly);
router.put('/:id', ...guard, readOnly);
router.patch('/:id', ...guard, readOnly);
router.delete('/:id', ...guard, readOnly);

export default router;
