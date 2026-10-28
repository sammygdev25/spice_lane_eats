import type { Order } from '../types';
import { Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Stack } from './ui';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderSummaryCardProps {
  order: Order;
}

function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const items = order.items ?? [];

  return (
    <Card>
      <CardBody>
        <Stack gap="sm">
          <div className="ds-between">
            <CardTitle>Order #{order.id}</CardTitle>
            <OrderStatusBadge status={order.status} />
          </div>
          <CardMeta>
            {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
            {order.orderType === 'delivery' && order.deliveryAddress
              ? ` to ${order.deliveryAddress}`
              : ''}
          </CardMeta>
          {items.length > 0 && (
            <ul className="ds-stack" style={{ gap: '0.25rem' }}>
              {items.map((item) => (
                <li key={item.id} className="ds-between">
                  <span className="ds-small">
                    {item.quantity} x {item.menuItem?.name ?? 'Menu item'}
                  </span>
                  <span className="ds-small ds-muted">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {order.notes && (
            <p className="ds-small ds-muted">Note: {order.notes}</p>
          )}
        </Stack>
      </CardBody>
      <CardFooter>
        <div className="ds-between">
          <span className="ds-small ds-muted">
            {Number(order.deliveryFee) > 0
              ? `Delivery fee: $${Number(order.deliveryFee).toFixed(2)}`
              : 'Spice Lane'}
          </span>
          <Price value={Number(order.totalAmount)} />
        </div>
      </CardFooter>
    </Card>
  );
}

export default OrderSummaryCard;
export { OrderSummaryCard };