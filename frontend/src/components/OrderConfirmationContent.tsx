import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardMeta, Stack, Button, Price, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Order } from '../types';

interface OrderConfirmationContentProps {
  order: Order | null;
  loading?: boolean;
}

export default function OrderConfirmationContent({ order, loading }: OrderConfirmationContentProps) {
  if (loading) {
    return <SkeletonCards count={1} />;
  }

  if (!order) {
    return (
      <EmptyState
        icon="alert"
        title="We couldn't find that order"
        text="The order you're looking for may have expired or the link is invalid."
        action={<Button to="/menu-items">Back to menu</Button>}
      />
    );
  }

  return (
    <Stack gap="lg">
      <Card>
        <CardBody>
          <Stack gap="sm">
            <Stack gap="xs" align="center" justify="center">
              <Icon name="check" size={32} title="Order confirmed" />
              <CardTitle>Thanks for your order, {order.customerName}!</CardTitle>
              <CardMeta>
                Order #{order.id} has been sent to Spice Lane's kitchen.
                {order.orderType === 'delivery'
                  ? ' We\u2019ll get it on its way to you soon.'
                  : ' We\u2019ll have it ready for pickup shortly.'}
              </CardMeta>
            </Stack>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stack gap="md">
            <CardTitle>Order details</CardTitle>
            <div className="ds-between">
              <span className="ds-muted">Order type</span>
              <span>{order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}</span>
            </div>
            {order.orderType === 'delivery' && order.deliveryAddress && (
              <div className="ds-between">
                <span className="ds-muted">Delivery address</span>
                <span>{order.deliveryAddress}</span>
              </div>
            )}
            <div className="ds-between">
              <span className="ds-muted">Phone</span>
              <span>{order.phone}</span>
            </div>
            {order.notes && (
              <div className="ds-between">
                <span className="ds-muted">Notes</span>
                <span>{order.notes}</span>
              </div>
            )}

            {order.items && order.items.length > 0 && (
              <Stack gap="xs">
                {order.items.map((item) => (
                  <div className="ds-between" key={item.id}>
                    <span>
                      {item.quantity} x {item.menuItem?.name ?? 'Menu item'}
                    </span>
                    <Price value={Number(item.price) * item.quantity} />
                  </div>
                ))}
              </Stack>
            )}

            {Number(order.deliveryFee) > 0 && (
              <div className="ds-between">
                <span className="ds-muted">Delivery fee</span>
                <Price value={Number(order.deliveryFee)} />
              </div>
            )}

            <div className="ds-between">
              <strong>Total</strong>
              <Price value={Number(order.totalAmount)} />
            </div>
          </Stack>
        </CardBody>
      </Card>

      <Stack gap="sm" justify="center">
        <Button to="/orders" variant="primary">
          View order history
        </Button>
        <Button to="/menu-items" variant="ghost">
          Back to menu
        </Button>
      </Stack>
    </Stack>
  );
}