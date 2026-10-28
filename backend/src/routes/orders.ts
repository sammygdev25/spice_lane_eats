import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, requireStaff, AuthRequest } from '../middleware/auth';

const router = Router();

const DELIVERY_FEE = 4.99;

const orderItemSchema = z.object({
  menuItemId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  customerName: z.string().min(1),
  phone: z.string().min(1),
  orderType: z.enum(['pickup', 'delivery']),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'preparing', 'completed', 'cancelled']),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// GET /api/orders/ - current user's orders, or all orders for staff
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const where = user.isStaff || user.role === 'staff' ? {} : { userId: req.userId };

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
    });

    res.json(
      orders.map((order) => ({
        ...order,
        deliveryFee: Number(order.deliveryFee),
        totalAmount: Number(order.totalAmount),
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
          menuItem: item.menuItem
            ? { ...item.menuItem, price: Number(item.menuItem.price) }
            : item.menuItem,
        })),
      }))
    );
  } catch (error) {
    console.error('[Orders] Error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - single order (owner or staff)
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const order = await prisma.order.findUnique({
      where: { id: parsedParams.data.id },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const isOwner = order.userId === req.userId;
    const isStaffUser = user.isStaff || user.role === 'staff';
    if (!isOwner && !isStaffUser) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({
      ...order,
      deliveryFee: Number(order.deliveryFee),
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        menuItem: item.menuItem
          ? { ...item.menuItem, price: Number(item.menuItem.price) }
          : item.menuItem,
      })),
    });
  } catch (error) {
    console.error('[Orders] Error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST /api/orders/ - place a new order (pickup or delivery)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }

  const { customerName, phone, orderType, deliveryAddress, notes, items } = parsed.data;

  if (orderType === 'delivery' && (!deliveryAddress || deliveryAddress.trim().length === 0)) {
    return res.status(400).json({ error: 'Delivery address is required for delivery orders' });
  }

  try {
    const menuItemIds = items.map((item) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    const menuItemMap = new Map(menuItems.map((mi) => [mi.id, mi]));

    for (const item of items) {
      const menuItem = menuItemMap.get(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ error: `Menu item ${item.menuItemId} not found` });
      }
      if (!menuItem.isAvailable) {
        return res.status(400).json({ error: `${menuItem.name} is currently unavailable` });
      }
    }

    const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
    const itemsTotal = items.reduce((sum, item) => {
      const menuItem = menuItemMap.get(item.menuItemId)!;
      return sum + Number(menuItem.price) * item.quantity;
    }, 0);
    const totalAmount = itemsTotal + deliveryFee;

    const order = await prisma.order.create({
      data: {
        userId: req.userId!,
        customerName,
        phone,
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress ?? '' : '',
        deliveryFee,
        notes: notes ?? '',
        totalAmount,
        status: 'pending',
        items: {
          create: items.map((item) => {
            const menuItem = menuItemMap.get(item.menuItemId)!;
            return {
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: Number(menuItem.price),
            };
          }),
        },
      },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
    });

    res.status(201).json({
      ...order,
      deliveryFee: Number(order.deliveryFee),
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        menuItem: item.menuItem
          ? { ...item.menuItem, price: Number(item.menuItem.price) }
          : item.menuItem,
      })),
    });
  } catch (error) {
    console.error('[Orders] Error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PATCH /api/orders/:id/status - staff updates order status
router.patch('/:id/status', authMiddleware, requireStaff, async (req: AuthRequest, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }

  const parsedBody = updateStatusSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsedBody.error.issues });
  }

  try {
    const existing = await prisma.order.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = await prisma.order.update({
      where: { id: parsedParams.data.id },
      data: { status: parsedBody.data.status },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
    });

    res.json({
      ...order,
      deliveryFee: Number(order.deliveryFee),
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        menuItem: item.menuItem
          ? { ...item.menuItem, price: Number(item.menuItem.price) }
          : item.menuItem,
      })),
    });
  } catch (error) {
    console.error('[Orders] Error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;