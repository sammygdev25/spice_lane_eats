import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import { DELIVERY_FEE } from '../lib/fees';
import { EmptyState, Alert } from '../components/ui';
import CheckoutHeader from '../components/CheckoutHeader';
import CheckoutForm, { CheckoutFormData } from '../components/CheckoutForm';
import CheckoutSummary from '../components/CheckoutSummary';
import type { Order } from '../types';

export default function CheckoutPage() {
  const { items, total, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [contactInfo, setContactInfo] = useState<CheckoutFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFee =
    contactInfo?.orderType === 'delivery' ? DELIVERY_FEE : 0;
  const orderTotal = total + deliveryFee;

  const handleFormSubmit = (data: CheckoutFormData) => {
    setError(null);
    setContactInfo(data);
  };

  const handlePlaceOrder = async () => {
    if (itemCount === 0) {
      setError('Your cart is empty. Add some items from the menu first.');
      return;
    }
    if (!contactInfo) {
      setError('Please fill in your contact and delivery details first.');
      return;
    }
    if (contactInfo.orderType === 'delivery' && !contactInfo.deliveryAddress) {
      setError('Please provide a delivery address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        contactName: contactInfo.customerName,
        contactPhone: contactInfo.phone,
        fulfillment: contactInfo.orderType,
        deliveryAddress:
          contactInfo.orderType === 'delivery'
            ? contactInfo.deliveryAddress
            : '',
        notes: contactInfo.notes || '',
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
      };
      const order = await api.post<Order>('/orders/', payload);
      clearCart();
      navigate('/orders/confirmation', { state: { order } });
    } catch (err) {
      console.error('[CheckoutPage] Error placing order:', err);
      setError(
        'We could not place your order right now. Please try again in a moment.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (itemCount === 0) {
    return (
      <div className="ds-stack-lg">
        <CheckoutHeader itemCount={0} />
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          text="Browse the Spice Lane menu and add a few dishes before checking out."
          action={<Link to="/menu-items">Browse the menu</Link>}
        />
      </div>
    );
  }

  return (
    <div className="ds-stack-lg">
      <CheckoutHeader itemCount={itemCount} />

      {error && <Alert tone="danger">{error}</Alert>}

      <div className="ds-grid-sidebar">
        <CheckoutForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
        <CheckoutSummary
          items={items}
          subtotal={total}
          deliveryFee={deliveryFee}
          total={orderTotal}
          onSubmit={handlePlaceOrder}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
