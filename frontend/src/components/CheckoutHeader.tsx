import { PageHeader } from '../components/ui';
import { Icon } from '../components/icons';

interface CheckoutHeaderProps {
  itemCount?: number;
}

export default function CheckoutHeader({ itemCount }: CheckoutHeaderProps) {
  return (
    <PageHeader
      eyebrow="Spice Lane"
      title="Checkout"
      subtitle={
        itemCount
          ? `Review your ${itemCount} item${itemCount === 1 ? '' : 's'} and choose pickup or delivery to finish your order.`
          : 'Choose pickup or delivery, add any notes, and place your order.'
      }
      actions={
        <div className="ds-cluster">
          <span className="ds-badge-step">
            <Icon name="cart" size={16} /> Cart
          </span>
          <Icon name="chevron-right" size={16} />
          <span className="ds-badge-step" style={{ color: 'var(--color-primary)' }}>
            <Icon name="credit-card" size={16} /> Checkout
          </span>
          <Icon name="chevron-right" size={16} />
          <span className="ds-badge-step">
            <Icon name="check" size={16} /> Confirmation
          </span>
        </div>
      }
    />
  );
}