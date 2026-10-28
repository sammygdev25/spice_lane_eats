import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getOrderList } from '../api';
import type { Order } from '../types';
import OrderHistoryHeader from '../components/OrderHistoryHeader';
import OrderHistoryContent from '../components/OrderHistoryContent';
import OrderHistoryDetails from '../components/OrderHistoryDetails';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadOrders() {
      setLoading(true);
      try {
        const data = await getOrderList();
        if (!cancelled) setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="ds-stack-lg">
      <OrderHistoryHeader userName={user?.name || user?.email} />
      <OrderHistoryContent orders={orders} loading={loading} />
      <OrderHistoryDetails user={user} />
    </div>
  );
}