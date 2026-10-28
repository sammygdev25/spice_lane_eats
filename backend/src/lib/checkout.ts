import { z } from 'zod';
// Scaffold-owned (checkout, PX.154 and PX.155): the delivery details a checkout form sends, read under the names forms
// use, checked, and stored on the order together with the delivery fee. The fee is the server's: the stored and charged
// total includes the fee the pages show (frontend/src/lib/fees.ts carries the same value).
// order model: Order, amount: totalAmount
export const DELIVERY_FEE = 3.99;
const NAMES = {
  contactName: ['contactName', 'name', 'fullName', 'customerName'],
  contactPhone: ['contactPhone', 'phone', 'phoneNumber', 'mobile'],
  deliveryAddress: ['deliveryAddress', 'address', 'shippingAddress', 'deliveryLocation'],
  notes: ['notes', 'deliveryNotes', 'instructions', 'specialInstructions'],
  fulfillment: ['fulfillment', 'fulfillmentType', 'fulfillmentMethod', 'deliveryMethod', 'deliveryType', 'orderType', 'method'],
} as const;
const NESTED = ['details', 'delivery', 'customer', 'checkout', 'contact'];
const text = (max: number) => z.string().trim().max(max).optional();
const detailsSchema = z.object({
  contactName: text(120),
  contactPhone: text(40),
  deliveryAddress: text(300),
  notes: text(1000),
  fulfillment: z.enum(['delivery', 'pickup']),
}).refine((d) => d.fulfillment === 'pickup' || Boolean(d.deliveryAddress), {
  message: 'A delivery address is required', path: ['deliveryAddress'],
});
export type CheckoutDetails = z.infer<typeof detailsSchema>;
export type CheckoutRead = { ok: true; details: CheckoutDetails } | { ok: false; issues: z.ZodIssue[] };
function source(body: unknown): Record<string, unknown> {
  const top = body !== null && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const merged: Record<string, unknown> = {};
  for (const key of NESTED) {
    const inner = top[key];
    if (inner !== null && typeof inner === 'object' && Array.isArray(inner) === false) Object.assign(merged, inner);
  }
  return { ...merged, ...top };
}
function first(src: Record<string, unknown>, keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = src[key];
    if (typeof value === 'string' && value.trim() !== '') return value;
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return undefined;
}
// A form that names no method delivers when it sent an address and is a pickup otherwise.
export function readCheckout(body: unknown): CheckoutRead {
  const src = source(body);
  const address = first(src, NAMES.deliveryAddress);
  const method = (first(src, NAMES.fulfillment) || '').toLowerCase();
  const delivers = method ? /deliver|ship/.test(method) : Boolean(address);
  const parsed = detailsSchema.safeParse({
    contactName: first(src, NAMES.contactName),
    contactPhone: first(src, NAMES.contactPhone),
    deliveryAddress: address,
    notes: first(src, NAMES.notes),
    fulfillment: delivers ? 'delivery' : 'pickup',
  });
  return parsed.success ? { ok: true, details: parsed.data } : { ok: false, issues: parsed.error.issues };
}
export function deliveryFee(details: CheckoutDetails): number {
  return details.fulfillment === 'delivery' ? DELIVERY_FEE : 0;
}
// The order total with the fee added, in whole cents so 12.5 + 3.99 stays 16.49.
export function withDeliveryFee(total: unknown, details: CheckoutDetails): number {
  return Math.round((Number(total) + deliveryFee(details)) * 100) / 100;
}
export function checkoutColumns(details: CheckoutDetails) {
  return {
    contactName: details.contactName ?? null,
    contactPhone: details.contactPhone ?? null,
    fulfillment: details.fulfillment,
    deliveryAddress: details.fulfillment === 'delivery' ? details.deliveryAddress ?? null : null,
    notes: details.notes ?? null,
    deliveryFee: deliveryFee(details),
  };
}
