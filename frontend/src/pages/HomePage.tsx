import { useEffect, useState } from 'react';
import { getMenuItemList, getCategoryList } from '../api';
import { useCart } from '../contexts/CartContext';
import type { MenuItem, Category } from '../types';
import HomeHero from '../components/HomeHero';
import HomeFeatured from '../components/HomeFeatured';
import HomeCategories from '../components/HomeCategories';
import HomeAbout from '../components/HomeAbout';
import HomeCta from '../components/HomeCta';

export default function HomePage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const [menuItems, cats] = await Promise.all([getMenuItemList(), getCategoryList()]);
        if (!active) return;
        setItems(menuItems.filter((i) => i.isAvailable).slice(0, 8));
        setCategories(cats);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    addItem(item, 1);
  };

  const heroImage = items[0]?.imageUrl;

  return (
    <div className="ds-stack-lg">
      <HomeHero imageUrl={heroImage} />
      <HomeFeatured items={items} loading={loading} onAddToCart={handleAddToCart} />
      <HomeCategories categories={categories} />
      <HomeAbout />
      <HomeCta />
    </div>
  );
}