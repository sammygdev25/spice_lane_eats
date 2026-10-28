import { Grid, Stat } from '../components/ui';

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
          icon="book"
        />
        <Stat
          value={loading ? '--' : String(totalCategories)}
          label="Categories"
          icon="grid"
        />
        <Stat
          value={loading ? '--' : String(availableItems)}
          label="Available now"
          icon="check"
        />
        <Stat
          value={loading ? '--' : String(pendingOrders)}
          label="Pending orders"
          icon="clock"
        />
      </Grid>
    </div>
  );
}
