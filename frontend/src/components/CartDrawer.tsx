import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItemRow from './CartItemRow';
import { Button, EmptyState, Price, Icon } from './ui';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
          zIndex: 90,
        }}
      />
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(420px, 100vw)',
          background: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
        }}
        aria-hidden={!isOpen}
      >
        <div className="ds-between" style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0, fontFamily: 'Poppins, sans-serif' }}>
            Your Spice Lane Cart{itemCount > 0 ? ` (${itemCount})` : ''}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text)',
            }}
          >
            <Icon name="close" size={22} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>
          {items.length === 0 ? (
            <EmptyState
              icon="cart"
              title="Your cart is empty"
              text="Add some spicy favorites from the menu to get your order started."
              action={
                <Button to="/menu-items" variant="primary" onClick={onClose}>
                  Browse the menu
                </Button>
              }
            />
          ) : (
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
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
            <div className="ds-between" style={{ marginBottom: '0.75rem' }}>
              <span className="ds-muted">Subtotal</span>
              <Price value={total} />
            </div>
            <div className="ds-stack" style={{ gap: '0.5rem' }}>
              <Button variant="primary" size="lg" onClick={handleCheckout}>
                Checkout
              </Button>
              <Button variant="ghost" onClick={clearCart}>
                Clear cart
              </Button>
            </div>
            <p className="ds-small ds-muted" style={{ marginTop: '0.75rem', textAlign: 'center' }}>
              Delivery fee and pickup/delivery options are set at checkout.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;