import { PageHeader } from '../components/ui';
import { Icon } from '../components/icons';

interface OrderConfirmationHeaderProps {
  orderId?: number | string;
}

export default function OrderConfirmationHeader({ orderId }: OrderConfirmationHeaderProps) {
  return (
    <PageHeader
      eyebrow="Spice Lane"
      title={
        <span className="ds-cluster">
          <Icon name="check" />
          Order confirmed
        </span>
      }
      subtitle={
        orderId
          ? `Thanks for your order! We're firing up the kitchen for order #${orderId}.`
          : "Thanks for your order! We're firing up the kitchen and will have it ready soon."
      }
    />
  );
}