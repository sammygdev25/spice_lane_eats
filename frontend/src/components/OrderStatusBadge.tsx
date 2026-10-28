import { Badge } from '../components/ui';

type Tone = 'neutral' | 'primary' | 'soft' | 'success' | 'danger';

interface OrderStatusBadgeProps {
  status: string;
}

const STATUS_CONFIG: Record<string, { label: string; tone: Tone }> = {
  pending: { label: 'Pending', tone: 'neutral' },
  paid: { label: 'Paid', tone: 'primary' },
  preparing: { label: 'Preparing', tone: 'soft' },
  completed: { label: 'Completed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
};

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, tone: 'neutral' as Tone };
  return <Badge tone={config.tone}>{config.label}</Badge>;
}

export { OrderStatusBadge };
export default OrderStatusBadge;