/**
 * Auto-generated TypeScript types and Zod schemas from ProjectContract.
 * Model interfaces match the Django backend exactly.
 */
import { z } from 'zod';

// DRF returns a related object either as its pk or nested; parse both to the pk
// so the parsed type matches the number typed FK fields on the interfaces.
const zRelation = z.union([z.coerce.number().int(), z.object({ id: z.coerce.number().int() }).passthrough()]).transform((v) => (typeof v === 'number' ? v : v.id));

// ── User ──
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export const UserSchema = z.object({
  id: z.coerce.number(),
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  phone: z.string(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

// ── Category ──
export interface Category {
  id: number;
  name: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const CategorySchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  displayOrder: z.coerce.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

// ── MenuItem ──
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: Category;
  categoryId: number;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export const MenuItemSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  category: z.custom<Category>((v) => typeof v === 'object' && v !== null).optional(),
  categoryId: z.coerce.number().int(),
  imageUrl: z.string(),
  isAvailable: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

// ── Order ──
export interface Order {
  id: number;
  user?: User;
  userId: number;
  customerName: string;
  phone: string;
  orderType: string;
  deliveryAddress: string;
  deliveryFee: number;
  notes: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const OrderSchema = z.object({
  id: z.coerce.number(),
  user: z.custom<User>((v) => typeof v === 'object' && v !== null).optional(),
  userId: z.coerce.number().int(),
  customerName: z.string(),
  phone: z.string(),
  orderType: z.string(),
  deliveryAddress: z.string(),
  deliveryFee: z.coerce.number(),
  notes: z.string(),
  totalAmount: z.coerce.number(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

// ── OrderItem ──
export interface OrderItem {
  id: number;
  order?: Order;
  orderId: number;
  menuItem?: MenuItem;
  menuItemId: number;
  quantity: number;
  price: number;
  createdAt: string;
}

export const OrderItemSchema = z.object({
  id: z.coerce.number(),
  order: z.custom<Order>((v) => typeof v === 'object' && v !== null).optional(),
  orderId: z.coerce.number().int(),
  menuItem: z.custom<MenuItem>((v) => typeof v === 'object' && v !== null).optional(),
  menuItemId: z.coerce.number().int(),
  quantity: z.coerce.number().int(),
  price: z.coerce.number(),
  createdAt: z.string(),
}).passthrough();

// ── Paginated Response ──
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    count: z.coerce.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  });

