import { Card, CardBody, CardTitle, Media, Price, Button, Stack } from '../components/ui';
import { Icon } from '../components/icons';
import type { CartItem } from '../contexts/CartContext.tsx';

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function CheckoutSummary({
  items,
  subtotal,
  deliveryFee,
  total,
  onSubmit,
  isSubmitting,
}: CheckoutSummaryProps) {
  return (
    <Card>
      <CardBody>
        <CardTitle>Your Order</CardTitle>
        <Stack gap="sm">
          {items.map((item) => (
            <div key={item.menuItemId} className="ds-cluster ds-between">
              <div className="ds-cluster">
                <Media
                  src={item.imageUrl}
                  alt={item.name}
                  ratio="square"
                />
                <div>
                  <div>{item.name}</div>
                  <span className="ds-muted ds-small">
                    Qty {item.quantity}
                  </span>
                </div>
              </div>
              <Price value={Number(item.price) * item.quantity} />
            </div>
          ))}
        </Stack>

        <div className="ds-stack" style={{ marginTop: '1rem' }}>
          <div className="ds-between">
            <span className="ds-muted">Subtotal</span>
            <Price value={subtotal} />
          </div>
          <div className="ds-between">
            <span className="ds-muted">
              <Icon name="truck" size={16} /> Delivery fee
            </span>
            <Price value={deliveryFee} />
          </div>
          <div className="ds-between">
            <strong>Total</strong>
            <Price value={total} />
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onSubmit}
          disabled={isSubmitting || items.length === 0}
        >
          {isSubmitting ? 'Placing order…' : 'Place order'}
        </Button>
      </CardBody>
    </Card>
  );
}
