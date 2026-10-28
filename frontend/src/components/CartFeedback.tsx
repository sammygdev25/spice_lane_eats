import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
// Scaffold-owned (cart_feedback, PX.21): the item count on the Cart link and a short notice on every cart change the
// shopper makes, whatever the pages do. Both read the cart context and never change it.
const CART_PATH: string = '';
const COUNT_KEYS = ['itemCount', 'totalItems', 'cartCount', 'count'];
const COUNT_GETTERS = ['getItemCount', 'getTotalItems', 'getCartCount'];
const LIST_KEYS = ['items', 'cartItems', 'cart', 'lines'];
const SHOW_MS = 2600;
const INPUT_MS = 3000;
const HIDDEN = { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const;
let lastInput = 0;
if (typeof window !== 'undefined') {
  const mark = () => { lastInput = Date.now(); };
  window.addEventListener('pointerdown', mark, true);
  window.addEventListener('keydown', mark, true);
}
export function cartCount(cart: unknown): number {
  const ctx = (cart !== null && typeof cart === 'object' ? cart : {}) as Record<string, unknown>;
  for (const key of COUNT_KEYS) {
    const value = ctx[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  }
  for (const key of COUNT_GETTERS) {
    const value = ctx[key];
    if (typeof value === 'function') {
      const n = Number(value());
      if (Number.isFinite(n)) return n;
    }
  }
  for (const key of LIST_KEYS) {
    const value = ctx[key];
    if (Array.isArray(value)) {
      return value.reduce((sum: number, line: unknown) => {
        const row = (line !== null && typeof line === 'object' ? line : {}) as Record<string, unknown>;
        const qty = Number(row.quantity ?? row.qty ?? 1);
        return sum + (Number.isFinite(qty) ? qty : 0);
      }, 0);
    }
  }
  return 0;
}
export function CartCount({ path }: { path: string }) {
  const count = cartCount(useCart());
  if (CART_PATH === '' || path !== CART_PATH || count <= 0) return null;
  return (
    <>
      <span aria-hidden="true" style={{ display: 'inline-block', minWidth: '1.25rem', marginLeft: '6px', padding: '0 6px',
        borderRadius: 'var(--radius-full)', background: 'var(--color-primary)', color: '#fff', fontSize: 'var(--text-xs)',
        fontWeight: 700, lineHeight: '1.25rem', textAlign: 'center' }}>{count > 99 ? '99+' : count}</span>
      <span style={HIDDEN}> ({count} {count === 1 ? 'item' : 'items'})</span>
    </>
  );
}
interface CartNote { text: string; count: number; at: number }
export function CartToast() {
  const count = cartCount(useCart());
  const { pathname } = useLocation();
  const before = useRef(count);
  const [note, setNote] = useState<CartNote | null>(null);
  useEffect(() => {
    const prev = before.current;
    before.current = count;
    if (count === prev || count <= 0 || Date.now() - lastInput > INPUT_MS) return;
    setNote({ text: count > prev ? 'Added to cart' : 'Cart updated', count, at: Date.now() });
  }, [count]);
  useEffect(() => {
    if (note === null) return undefined;
    const timer = window.setTimeout(() => setNote(null), SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [note]);
  return (
    <div role="status" aria-live="polite" style={{ position: 'fixed', right: '16px', bottom: '16px', zIndex: 1100,
      maxWidth: 'calc(100vw - 32px)', pointerEvents: note ? 'auto' : 'none' }}>
      {note ? (
        <div key={note.at} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
          background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)',
          borderLeft: '4px solid var(--color-success)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
          fontSize: 'var(--text-sm)' }}>
          <span>{note.text} ({note.count} {note.count === 1 ? 'item' : 'items'})</span>
          {CART_PATH !== '' && pathname !== CART_PATH ? (
            <Link to={CART_PATH} onClick={() => setNote(null)}
              style={{ color: 'var(--color-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>View cart</Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
