import type { Category } from '../types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

function CategoryTabs({ categories, activeCategory, onSelectCategory }: CategoryTabsProps) {
  const sorted = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="ds-cluster" role="tablist" aria-label="Menu categories">
      <button
        type="button"
        role="tab"
        aria-selected={activeCategory === ''}
        className="btn"
        style={{
          borderRadius: 'var(--radius-lg, 999px)',
          background: activeCategory === '' ? 'var(--color-primary)' : 'var(--color-surface)',
          color: activeCategory === '' ? '#fff' : 'var(--color-text)',
          border: '1px solid var(--color-border)',
        }}
        onClick={() => onSelectCategory('')}
      >
        All Dishes
      </button>
      {sorted.map((category) => {
        const isActive = activeCategory === category.name;
        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className="btn"
            style={{
              borderRadius: 'var(--radius-lg, 999px)',
              background: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
              color: isActive ? '#fff' : 'var(--color-text)',
              border: '1px solid var(--color-border)',
            }}
            onClick={() => onSelectCategory(category.name)}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryTabs;
export { CategoryTabs };