import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import type { Order } from '../types';
import { getOrder } from '../api';
import OrderConfirmationHeader from '../components/OrderConfirmationHeader';
import OrderConfirmationContent from '../components/OrderConfirmationContent';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const stateOrder = (location.state as { order?: Order } | null)?.order ?? null;

  const [order, setOrder] = useState<Order | null>(stateOrder);
  const [loading, setLoading] = useState<boolean>(!stateOrder);

  useEffect(() => {
    if (stateOrder) {
      setOrder(stateOrder);
      setLoading(false);
      return;
    }
    const orderIdParam = searchParams.get('order');
    if (!orderIdParam) {
      setLoading(false);
      return;
    }
    const orderId = Number(orderIdParam);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getOrder(orderId)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((err) => {
        console.error('[OrderConfirmationPage] Failed to load order:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [stateOrder, searchParams]);

  return (
    <div className="ds-stack-lg">
      <OrderConfirmationHeader orderId={order?.id} />
      <OrderConfirmationContent order={order} loading={loading} />
    </div>
  );
}