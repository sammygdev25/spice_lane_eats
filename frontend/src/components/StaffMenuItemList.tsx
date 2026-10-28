import type { MenuItem } from '../types';
import { Button } from '../components/ui';
import { Icon } from '../components/icons';

interface StaffMenuItemListProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

function StaffMenuItemList({ items, onEdit, onDelete }: StaffMenuItemListProps) {
  if (!items.length) {
    return (
      <p className="ds-muted ds-small">
        No menu items yet. Add your first Spice Lane dish to get the menu going.
      </p>
    );
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Dish</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="ds-cluster" style={{ alignItems: 'center' }}>
                  <strong>{item.name}</strong>
                </div>
                {item.description && (
                  <div className="ds-small ds-muted">{item.description}</div>
                )}
              </td>
              <td>{item.category?.name ?? '—'}</td>
              <td>${Number(item.price).toFixed(2)}</td>
              <td>
                {item.isAvailable ? (
                  <span style={{ color: 'var(--color-success)' }}>
                    <Icon name="check" size={14} /> Available
                  </span>
                ) : (
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    <Icon name="close" size={14} /> 86'd
                  </span>
                )}
              </td>
              <td>
                <div className="ds-cluster" style={{ gap: '0.5rem' }}>
                  <Button variant="ghost" size="md" onClick={() => onEdit(item)}>
                    <Icon name="edit" size={16} /> Edit
                  </Button>
                  <Button variant="danger" size="md" onClick={() => onDelete(item)}>
                    <Icon name="trash" size={16} /> Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffMenuItemList;
export { StaffMenuItemList };