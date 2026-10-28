import { useState, useEffect, FormEvent } from 'react';
import { Button } from './ui';
import type { MenuItem, Category } from '../types';

interface StaffMenuItemFormProps {
  initialData?: Partial<MenuItem> | null;
  categories: Category[];
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    imageUrl: string;
    isAvailable: boolean;
  }) => void;
  onCancel: () => void;
}

function StaffMenuItemForm({ initialData, categories, onSubmit, onCancel }: StaffMenuItemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(initialData?.name ?? '');
    setDescription(initialData?.description ?? '');
    setPrice(initialData?.price !== undefined ? String(initialData.price) : '');
    setCategoryId(
      initialData?.categoryId !== undefined
        ? String(initialData.categoryId)
        : categories.length > 0
        ? String(categories[0].id)
        : ''
    );
    setImageUrl(initialData?.imageUrl ?? '');
    setIsAvailable(initialData?.isAvailable ?? true);
  }, [initialData, categories]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Give this dish a name.');
      return;
    }
    const priceNum = Number(price);
    if (!price || isNaN(priceNum) || priceNum < 0) {
      setError('Enter a valid price.');
      return;
    }
    if (!categoryId) {
      setError('Choose a category for this item.');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      categoryId: Number(categoryId),
      imageUrl: imageUrl.trim(),
      isAvailable,
    });
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && (
        <div className="ds-alert" role="alert" style={{ color: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      <div className="ds-field">
        <label className="ds-label" htmlFor="item-name">Dish name</label>
        <input
          id="item-name"
          className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Szechuan Noodle Bowl"
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="item-description">Description</label>
        <textarea
          id="item-description"
          className="input"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description of ingredients and flavor"
        />
      </div>

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="item-price">Price ($)</label>
          <input
            id="item-price"
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="item-category">Category</label>
          <select
            id="item-category"
            className="input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.length === 0 && <option value="">No categories yet</option>}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="item-image">Image URL</label>
        <input
          id="item-image"
          className="input"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="/img/dishes/example.jpg"
        />
        <span className="ds-help">Path to an image under /img/</span>
      </div>

      <div className="ds-field">
        <label className="ds-cluster" style={{ alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          <span className="ds-label" style={{ margin: 0 }}>Available on the menu</span>
        </label>
      </div>

      <div className="ds-form-actions">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData?.id ? 'Save changes' : 'Add menu item'}
        </Button>
      </div>
    </form>
  );
}

export default StaffMenuItemForm;