import { describe, expect, it } from 'vitest';
import { checkoutColumns, DELIVERY_FEE, readCheckout, withDeliveryFee } from '../src/lib/checkout';
// Scaffold-owned (checkout, PX.154 and PX.155): what the order routes store from a checkout form and charge for it.
function details(body: unknown) {
  const read = readCheckout(body);
  if (read.ok === false) throw new Error(JSON.stringify(read.issues));
  return read.details;
}
describe('checkout details', () => {
  it('reads the names checkout forms use, flat or nested', () => {
    const flat = details({ items: [], name: ' Ana ', phone: '555 0100', address: '1 Main St', notes: 'gate 4' });
    expect(checkoutColumns(flat)).toEqual({ contactName: 'Ana', contactPhone: '555 0100', fulfillment: 'delivery',
      deliveryAddress: '1 Main St', notes: 'gate 4', deliveryFee: DELIVERY_FEE });
    const nested = details({ items: [], details: { fullName: 'Bo', phoneNumber: 5550101, deliveryAddress: '2 Oak Ave' } });
    expect(checkoutColumns(nested).contactName).toBe('Bo');
    expect(checkoutColumns(nested).contactPhone).toBe('5550101');
    expect(checkoutColumns(nested).deliveryAddress).toBe('2 Oak Ave');
  });
  it('is a pickup with no fee and no address unless the form delivers', () => {
    const none = details({ items: [] });
    expect(checkoutColumns(none)).toEqual({ contactName: null, contactPhone: null, fulfillment: 'pickup',
      deliveryAddress: null, notes: null, deliveryFee: 0 });
    const pickup = details({ fulfillment: 'pickup', address: '1 Main St' });
    expect(checkoutColumns(pickup).deliveryAddress).toBeNull();
    expect(withDeliveryFee(20, pickup)).toBe(20);
  });
  it('refuses a delivery with no address and text past its limit', () => {
    expect(readCheckout({ deliveryMethod: 'delivery' }).ok).toBe(false);
    expect(readCheckout({ address: '1 Main St', notes: 'x'.repeat(1001) }).ok).toBe(false);
  });
  it('adds the fee to a delivered total in whole cents', () => {
    const delivered = details({ address: '1 Main St' });
    expect(withDeliveryFee('12.5', delivered)).toBe(Math.round((12.5 + DELIVERY_FEE) * 100) / 100);
  });
});
