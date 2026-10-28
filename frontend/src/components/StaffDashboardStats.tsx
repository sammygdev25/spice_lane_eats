import { Grid, Stat } from '../components/ui';
import { Icon } from '../components/icons';

interface StaffDashboardStatsProps {
  totalMenuItems: number;
  totalCategories: number;
  availableItems: number;
  pendingOrders: number;
  loading?: boolean;
}

export default function StaffDashboardStats({
  totalMenuItems,
  totalCategories,
  availableItems,
  pendingOrders,
  loading = false,
}: StaffDashboardStatsProps) {
  return (
    <div className="ds-section">
      <Grid size="sm">
        <Stat
          value={loading ? '--' : String(totalMenuItems)}
          label="Menu items"
          icon={<Icon name="book" />}
        />
        <Stat
          value={loading ? '--' : String(totalCategories)}
          label="Categories"
          icon={<Icon name="grid" />}
        />
        <Stat
          value={loading ? '--' : String(availableItems)}
          label="Available now"
          icon={<Icon name="check" />}
        />
        <Stat
          value={loading ? '--' : String(pendingOrders)}
          label="Pending orders"
          icon={<Icon name="clock" />}
        />
      </Grid>
    </div>
  );
}