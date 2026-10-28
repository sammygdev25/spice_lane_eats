import type { Category } from '../types';
import { Button } from './ui';
import { Icon } from './icons';

interface StaffCategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

function StaffCategoryList({ categories, onEdit, onDelete }: StaffCategoryListProps) {
  if (categories.length === 0) {
    return <p className="ds-muted">No categories yet. Add one to start organizing the Spice Lane menu.</p>;
  }

  const sorted = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((category) => (
            <tr key={category.id}>
              <td>{category.displayOrder}</td>
              <td>{category.name}</td>
              <td>
                <div className="ds-cluster">
                  <Button variant="ghost" size="md" onClick={() => onEdit(category)}>
                    <Icon name="edit" size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" size="md" onClick={() => onDelete(category)}>
                    <Icon name="trash" size={16} />
                    Delete
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

export default StaffCategoryList;
export { StaffCategoryList };