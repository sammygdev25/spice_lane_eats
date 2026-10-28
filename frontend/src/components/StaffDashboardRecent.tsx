import { Section, EmptyState, Badge, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { Order } from '../types';

interface StaffDashboardRecentProps {
  orders: Order[];
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'completed':
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'preparing':
    case 'out_for_delivery':
      return 'primary';
    default:
      return 'soft';
  }
}

export default function StaffDashboardRecent({ orders }: StaffDashboardRecentProps) {
  return (
    <Section
      eyebrow="Kitchen pulse"
      title="Recent activity"
      subtitle="The latest orders coming in to Spice Lane"
      actions={<Button to="/orders" variant="ghost">View all orders</Button>}
    >
      {orders.length === 0 ? (
        <EmptyState
          icon="clock"
          title="No orders yet"
          text="Once customers start placing orders at Spice Lane, the most recent ones will show up here."
          action={<Button to="/menu-items" variant="primary">View menu</Button>}
        />
      ) : (
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>
                    <span className="ds-cluster">
                      <Icon
                        name={order.orderType === 'delivery' ? 'truck' : 'package'}
                        size={16}
                      />
                      {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                    </span>
                  </td>
                  <td>${Number(order.totalAmount).toFixed(2)}</td>
                  <td>
                    <Badge tone={statusTone(order.status)}>{order.status.replace(/_/g, ' ')}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}