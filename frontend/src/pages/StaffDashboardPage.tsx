import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api, getMenuItemList, getCategoryList, getOrderList } from '../api';
import type { MenuItem, Category, Order } from '../types';
import StaffDashboardHeader from '../components/StaffDashboardHeader';
import StaffDashboardStats from '../components/StaffDashboardStats';
import StaffDashboardRecent from '../components/StaffDashboardRecent';
import StaffDashboardActions from '../components/StaffDashboardActions';
import StaffMenuItemList from '../components/StaffMenuItemList';
import StaffCategoryList from '../components/StaffCategoryList';
import StaffMenuItemForm from '../components/StaffMenuItemForm';
import StaffCategoryForm from '../components/StaffCategoryForm';
import { Section, Alert, LoadingBlock, Button } from '../components/ui';

export default function StaffDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemStatus, setItemStatus] = useState<string | null>(null);

  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryStatus, setCategoryStatus] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [itemsRes, categoriesRes, ordersRes] = await Promise.all([
        getMenuItemList(),
        getCategoryList(),
        getOrderList(),
      ]);
      setMenuItems(itemsRes);
      setCategories(categoriesRes);
      setOrders(ordersRes);
    } catch (err) {
      console.error(err);
      setError('Could not load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAddItem = () => {
    setEditingItem(null);
    setItemFormOpen(true);
  };
  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemFormOpen(true);
  };
  const closeItemForm = async () => {
    setItemFormOpen(false);
    setEditingItem(null);
  };

  const handleSubmitItem = async (data: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    imageUrl: string;
    isAvailable: boolean;
  }) => {
    setItemStatus(editingItem ? 'Saving...' : 'Adding...');
    try {
      if (editingItem) {
        await api.put(`/menu-items/${editingItem.id}/`, data);
        setItemStatus('Saved');
      } else {
        await api.post('/menu-items/', data);
        setItemStatus('Added');
      }
      closeItemForm();
      await loadData();
    } catch (err) {
      console.error(err);
      setItemStatus(null);
      setError('Could not save the menu item.');
      return;
    } finally { setLoading(false); }
    setTimeout(() => setItemStatus(null), 2000);
  };

  const handleDeleteItem = async (item: MenuItem) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    try {
      await api.delete(`/menu-items/${item.id}/`);
      await loadData();
    } catch (err) {
      console.error(err);
      setError('Could not delete the menu item.');
    } finally { setLoading(false); }
  };

  const openAddCategory = async () => {
    setEditingCategory(null);
    setCategoryFormOpen(true);
  };
  const openEditCategory = async (category: Category) => {
    setEditingCategory(category);
    setCategoryFormOpen(true);
  };
  const closeCategoryForm = async () => {
    setCategoryFormOpen(false);
    setEditingCategory(null);
  };

  const handleSubmitCategory = async (data: { name: string; displayOrder: number }) => {
    setCategoryStatus(editingCategory ? 'Saving...' : 'Adding...');
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}/`, data);
        setCategoryStatus('Saved');
      } else {
        await api.post('/categories/', data);
        setCategoryStatus('Added');
      }
      closeCategoryForm();
      await loadData();
    } catch (err) {
      console.error(err);
      setCategoryStatus(null);
      setError('Could not save the category.');
      return;
    } finally { setLoading(false); }
    setTimeout(() => setCategoryStatus(null), 2000);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!window.confirm(`Delete category "${category.name}"? Its menu items will be removed too.`)) return;
    try {
      await api.delete(`/categories/${category.id}/`);
      await loadData();
    } catch (err) {
      console.error(err);
      setError('Could not delete the category.');
    } finally { setLoading(false); }
  };

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const availableItems = menuItems.filter((i) => i.isAvailable).length;

  if (loading) {
    return <LoadingBlock label="Loading the Spice Lane staff dashboard..." />;
  }

  return (
    <div className="ds-stack-lg">
      {error && <Alert tone="danger">{error}</Alert>}

      <StaffDashboardHeader userName={user?.name ?? undefined} onAddMenuItem={openAddItem} />

      <StaffDashboardStats
        totalMenuItems={menuItems.length}
        totalCategories={categories.length}
        availableItems={availableItems}
        pendingOrders={pendingOrders}
      />

      <StaffDashboardRecent orders={orders} />

      <StaffDashboardActions
        onAddMenuItem={openAddItem}
        onAddCategory={openAddCategory}
        onViewOrders={() => navigate('/orders')}
      />

      <Section
        title="Menu items"
        tight
        actions={
          !itemFormOpen ? (
            <Button variant="primary" onClick={openAddItem}>
              Add menu item
            </Button>
          ) : undefined
        }
      >
        {itemStatus && <Alert tone="success">{itemStatus}</Alert>}
        {itemFormOpen ? (
          <StaffMenuItemForm
            initialData={editingItem}
            categories={categories}
            onSubmit={handleSubmitItem}
            onCancel={closeItemForm}
          />
        ) : (
          <StaffMenuItemList items={menuItems} onEdit={openEditItem} onDelete={handleDeleteItem} />
        )}
      </Section>

      <Section
        title="Categories"
        tight
        actions={
          !categoryFormOpen ? (
            <Button variant="secondary" onClick={openAddCategory}>
              Add category
            </Button>
          ) : undefined
        }
      >
        {categoryStatus && <Alert tone="success">{categoryStatus}</Alert>}
        {categoryFormOpen ? (
          <StaffCategoryForm
            initialData={editingCategory}
            onSubmit={handleSubmitCategory}
            onCancel={closeCategoryForm}
          />
        ) : (
          <StaffCategoryList categories={categories} onEdit={openEditCategory} onDelete={handleDeleteCategory} />
        )}
      </Section>
    </div>
  );
}
