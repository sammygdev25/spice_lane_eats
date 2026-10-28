import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface StaffDashboardHeaderProps {
  userName?: string;
  onAddMenuItem: () => void;
}

export default function StaffDashboardHeader({ userName, onAddMenuItem }: StaffDashboardHeaderProps) {
  return (
    <PageHeader
      eyebrow="Spice Lane Staff"
      title="Staff Dashboard"
      subtitle={
        userName
          ? `Welcome back, ${userName}. Here's what's cooking at Spice Lane today.`
          : "Welcome back. Here's what's cooking at Spice Lane today."
      }
      actions={
        <Button variant="primary" size="lg" onClick={onAddMenuItem}>
          <Icon name="plus" size={18} />
          Add Menu Item
        </Button>
      }
    />
  );
}