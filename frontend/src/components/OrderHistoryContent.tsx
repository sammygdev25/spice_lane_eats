import { Section, Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, Button, EmptyState, SkeletonCards } from '../components/ui';
import { Icon } from '../components/icons';
import type { Order } from '../types';

interface OrderHistoryContentProps {
  orders: Order[];
  loading?: boolean;
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'paid':
    case 'completed':
      return 'success';
    case 'preparing':
      return 'primary';
    case 'cancelled':
      return 'danger';
    default:
      return 'soft';
  }
}

export default function OrderHistoryContent({ orders, loading }: OrderHistoryContentProps) {
  if (loading) {
    return (
      <Section eyebrow="Your orders" title="Order history">
        <SkeletonCards count={3} />
      </Section>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Section eyebrow="Your orders" title="Order history">
        <EmptyState
          icon="package"
          title="No orders yet"
          text="Once you place an order with Spice Lane, it will show up here with its status and total."
          action={<Button to="/menu-items" variant="primary">Browse the menu</Button>}
        />
      </Section>
    );
  }

  return (
    <Section eyebrow="Your orders" title="Order history" subtitle="Track every pickup and delivery you've placed with Spice Lane.">
      <div className="ds-stack">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardBody>
              <div className="ds-between">
                <CardTitle>Order #{order.id}</CardTitle>
                <Badge tone={statusTone(order.status)}>{order.status}</Badge>
              </div>
              <CardMeta>
                <Icon name={order.orderType === 'delivery' ? 'truck' : 'package'} size={16} />
                {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                {order.deliveryAddress ? ` · ${order.deliveryAddress}` : ''}
              </CardMeta>
              <CardMeta>
                <Icon name="clock" size={16} />
                {new Date(order.createdAt).toLocaleString()}
              </CardMeta>
              <CardFooter>
                <span className="ds-price">${Number(order.totalAmount).toFixed(2)}</span>
                {order.notes ? <span className="ds-small ds-muted">Note: {order.notes}</span> : null}
              </CardFooter>
            </CardBody>
          </Card>
        ))}
      </div>
    </Section>
  );
}