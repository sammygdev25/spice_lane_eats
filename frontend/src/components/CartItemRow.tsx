import { Media } from './ui';
import { Icon } from './icons';

export interface CartItemType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartItemRowProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const lineTotal = item.price * item.quantity;

  const handleDecrement = () => {
    if (item.quantity <= 1) {
      onRemove(item.id);
    } else {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="ds-cluster ds-between" style={{ alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ width: '56px', flexShrink: 0 }}>
        <Media src={item.imageUrl} alt={item.name} ratio="square" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-heading, inherit)', fontWeight: 600, color: 'var(--color-text)' }}>
          {item.name}
        </div>
        <div className="ds-small ds-muted">
          ${Number(item.price || 0).toFixed(2)} each
        </div>
      </div>

      <div className="ds-cluster" style={{ alignItems: 'center', gap: '0.5rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleDecrement}
          aria-label={item.quantity <= 1 ? 'Remove item' : 'Decrease quantity'}
          style={{ padding: '0.25rem 0.5rem', lineHeight: 1 }}
        >
          <Icon name="minus" size={14} />
        </button>
        <span style={{ minWidth: '1.5rem', textAlign: 'center', fontWeight: 600 }}>
          {item.quantity}
        </span>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleIncrement}
          aria-label="Increase quantity"
          style={{ padding: '0.25rem 0.5rem', lineHeight: 1 }}
        >
          <Icon name="plus" size={14} />
        </button>
      </div>

      <div style={{ minWidth: '4rem', textAlign: 'right', fontWeight: 700, color: 'var(--color-primary)' }}>
        ${Number(lineTotal || 0).toFixed(2)}
      </div>

      <button
        type="button"
        className="btn btn-danger"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name} from cart`}
        style={{ padding: '0.3rem 0.5rem', lineHeight: 1 }}
      >
        <Icon name="trash" size={14} />
      </button>
    </div>
  );
}

export default CartItemRow;