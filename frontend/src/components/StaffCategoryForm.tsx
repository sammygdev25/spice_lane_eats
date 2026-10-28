import { useState, FormEvent } from 'react';
import { Button } from './ui';
import type { Category } from '../types';

interface StaffCategoryFormProps {
  initialData?: Partial<Category> | null;
  onSubmit: (data: { name: string; displayOrder: number }) => void;
  onCancel: () => void;
}

function StaffCategoryForm({ initialData, onSubmit, onCancel }: StaffCategoryFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [displayOrder, setDisplayOrder] = useState(
    initialData?.displayOrder !== undefined ? String(initialData.displayOrder) : '0'
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    setError('');
    onSubmit({
      name: name.trim(),
      displayOrder: Number(displayOrder) || 0,
    });
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && (
        <div className="ds-alert" role="alert" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
          {error}
        </div>
      )}
      <div className="ds-field">
        <label className="ds-label" htmlFor="category-name">
          Category name
        </label>
        <input
          id="category-name"
          className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Curries, Starters, Naan & Rice"
          required
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="category-order">
          Display order
        </label>
        <input
          id="category-order"
          className="input"
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          placeholder="0"
        />
        <p className="ds-help">Lower numbers appear first on the menu.</p>
      </div>

      <div className="ds-form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData?.name ? 'Save changes' : 'Add category'}
        </Button>
      </div>
    </form>
  );
}

export default StaffCategoryForm;
export { StaffCategoryForm };