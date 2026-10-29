import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItemRow from '../components/CartItemRow';
import { EmptyState } from '../components/ui';

export default function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart();

  if (itemCount === 0) {
    return (
      <div className="ds-stack-lg" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--space-lg)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading, inherit)' }}>Your Cart</h1>
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          text="Browse the Spice Lane menu and add some dishes to get started."
          action={<Link to="/menu-items" className="btn btn-primary">Browse the menu</Link>}
        />
      </div>
    );
  }

  return (
    <div className="ds-stack-lg" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--space-lg)' }}>
      <h1 style={{ fontFamily: 'var(--font-heading, inherit)' }}>Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>

      <div className="ds-stack">
        {items.map((item: any) => (
          <CartItemRow
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Subtotal</span>
        <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>
          ${Number(total || 0).toFixed(2)}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <Link to="/checkout" className="btn btn-primary" style={{ flex: 1, textAlign: 'center', fontSize: 'var(--text-base)', padding: '12px 24px' }}>
          Checkout
        </Link>
        <Link to="/menu-items" className="btn btn-secondary" style={{ textAlign: 'center', fontSize: 'var(--text-base)', padding: '12px 24px' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
