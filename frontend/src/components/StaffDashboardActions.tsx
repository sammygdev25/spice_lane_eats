import { Section, Cluster, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface StaffDashboardActionsProps {
  onAddMenuItem: () => void;
  onAddCategory: () => void;
  onViewOrders?: () => void;
}

export default function StaffDashboardActions({ onAddMenuItem, onAddCategory, onViewOrders }: StaffDashboardActionsProps) {
  return (
    <Section title="Quick actions" tight>
      <Cluster gap="sm">
        <Button variant="primary" onClick={onAddMenuItem}>
          <Icon name="plus" size={16} />
          New menu item
        </Button>
        <Button variant="secondary" onClick={onAddCategory}>
          <Icon name="tag" size={16} />
          New category
        </Button>
        <Button variant="ghost" to="/menu-items">
          <Icon name="book" size={16} />
          View live menu
        </Button>
        <Button variant="ghost" to="/orders">
          <Icon name="package" size={16} />
          Order history
        </Button>
        {onViewOrders && (
          <Button variant="ghost" onClick={onViewOrders}>
            <Icon name="refresh" size={16} />
            Refresh dashboard
          </Button>
        )}
      </Cluster>
    </Section>
  );
}