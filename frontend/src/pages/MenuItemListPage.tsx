import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategoryList, getMenuItemList } from '../api';
import { useCart } from '../contexts/CartContext';
import type { Category, MenuItem } from '../types';
import MenuItemListHeader from '../components/MenuItemListHeader';
import MenuItemListFilters from '../components/MenuItemListFilters';
import MenuItemListGrid from '../components/MenuItemListGrid';
import MenuItemListPagination from '../components/MenuItemListPagination';

const PAGE_SIZE = 9;

export default function MenuItemListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [catData, itemData] = await Promise.all([getCategoryList(), getMenuItemList()]);
        setCategories(catData);
        setItems(itemData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const paramCategory = searchParams.get('category') || '';
    setCategory(paramCategory);
  }, [searchParams]);

  const handleCategoryChange = useCallback(
    (value: string) => {
      setCategory(value);
      setCurrentPage(1);
      if (value) {
        setSearchParams({ category: value });
      } else {
        setSearchParams({});
      }
    },
    [setSearchParams]
  );

  const filteredItems = useMemo(() => {
    let result = items.filter((item) => item.isAvailable !== false);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) || (item.description || '').toLowerCase().includes(q)
      );
    }

    if (category) {
      result = result.filter((item) => {
        const cat = categories.find((c) => String(c.id) === category || c.name === category);
        return cat ? item.categoryId === cat.id : true;
      });
    }

    const sorted = [...result];
    if (sort === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'price-asc') {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === 'price-desc') {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return sorted;
  }, [items, search, category, categories, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSort(value);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearch('');
    setSort('name');
    handleCategoryChange('');
  }, [handleCategoryChange]);

  const handleAddToCart = useCallback(
    (item: MenuItem) => {
      addItem(item, 1);
    },
    [addItem]
  );

  return (
    <div className="ds-stack-lg">
      <MenuItemListHeader resultCount={filteredItems.length} loading={loading} />
      <MenuItemListFilters
        categories={categories}
        search={search}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        sort={sort}
        onSortChange={handleSortChange}
      />
      <MenuItemListGrid
        items={pagedItems}
        loading={loading}
        onAddToCart={handleAddToCart}
        onClearFilters={handleClearFilters}
      />
      <MenuItemListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}