import type { Order } from '../types';
import { Card, CardBody, CardTitle, CardMeta, CardFooter, EmptyState, Button, Stack, Price } from '../components/ui';
import { Icon } from '../components/icons';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderHistoryListProps {
  orders: Order[];
  onPayOrder: (order: Order) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function OrderHistoryList({ orders, onPayOrder }: OrderHistoryListProps) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon="package"
        title="No orders yet"
        text="Once you order from the Spice Lane menu, your pickup and delivery orders will show up here."
        action={<Button to="/menu-items">Browse the menu</Button>}
      />
    );
  }

  return (
    <Stack gap="md">
      {orders.map((order) => {
        const isUnpaid = order.status === 'pending';
        return (
          <Card key={order.id}>
            <CardBody>
              <Stack gap="sm">
                <div className="ds-between">
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <CardMeta>{formatDate(order.createdAt)}</CardMeta>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="ds-cluster">
                  <span className="ds-small ds-muted">
                    <Icon name={order.orderType === 'delivery' ? 'truck' : 'package'} size={14} />{' '}
                    {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                  </span>
                  {order.orderType === 'delivery' && order.deliveryAddress && (
                    <span className="ds-small ds-muted">
                      <Icon name="map-pin" size={14} /> {order.deliveryAddress}
                    </span>
                  )}
                </div>

                {order.items && order.items.length > 0 && (
                  <ul className="ds-small ds-muted" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.quantity} × {item.menuItem?.name ?? 'Menu item'}
                      </li>
                    ))}
                  </ul>
                )}

                {order.notes && (
                  <p className="ds-small ds-muted">Notes: {order.notes}</p>
                )}
              </Stack>
            </CardBody>
            <CardFooter>
              <Price value={Number(order.totalAmount)} />
              {isUnpaid && (
                <Button variant="primary" onClick={() => onPayOrder(order)}>
                  Pay now
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </Stack>
  );
}

export default OrderHistoryList;