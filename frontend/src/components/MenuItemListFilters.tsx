import { Section } from '../components/ui';
import { Icon } from '../components/icons';
import type { Category } from '../types';

interface MenuItemListFiltersProps {
  categories: Category[];
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

export default function MenuItemListFilters({
  categories,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: MenuItemListFiltersProps) {
  return (
    <Section tight>
      <div className="ds-filters">
        <div className="ds-field" style={{ flex: '1 1 260px' }}>
          <label className="ds-label" htmlFor="menu-search">
            Search the menu
          </label>
          <div className="ds-cluster" style={{ position: 'relative' }}>
            <Icon name="search" size={16} />
            <input
              id="menu-search"
              className="input"
              type="text"
              placeholder="Search for curry, noodles, dumplings..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="menu-category">
            Category
          </label>
          <select
            id="menu-category"
            className="input"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="menu-sort">
            Sort by
          </label>
          <select
            id="menu-sort"
            className="input"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="default">Chef's order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>
    </Section>
  );
}