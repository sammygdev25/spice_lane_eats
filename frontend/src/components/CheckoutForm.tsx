import { useState, FormEvent } from 'react';
import { Section, Button, Alert } from '../components/ui';
import { Icon } from '../components/icons';

export interface CheckoutFormData {
  customerName: string;
  phone: string;
  orderType: 'pickup' | 'delivery';
  deliveryAddress: string;
  notes: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isSubmitting: boolean;
}

export default function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      setError('Please tell us your name and phone number so Spice Lane can reach you.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setError('Please add a delivery address so we know where to send your order.');
      return;
    }
    setError('');
    onSubmit({ customerName, phone, orderType, deliveryAddress, notes });
  };

  return (
    <Section eyebrow="Checkout" title="Pickup or delivery details" tight>
      {error && <Alert tone="danger">{error}</Alert>}
      <form className="ds-form" onSubmit={handleSubmit}>
        <div className="ds-form-row">
          <div className="ds-field">
            <label className="ds-label" htmlFor="customerName">Full name</label>
            <input
              id="customerName"
              className="input"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="ds-field">
            <label className="ds-label" htmlFor="phone">Phone number</label>
            <input
              id="phone"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div className="ds-field">
          <label className="ds-label">How would you like your order?</label>
          <div className="ds-cluster">
            <Button
              type="button"
              variant={orderType === 'pickup' ? 'primary' : 'secondary'}
              onClick={() => setOrderType('pickup')}
            >
              <Icon name="package" size={16} /> Pickup
            </Button>
            <Button
              type="button"
              variant={orderType === 'delivery' ? 'primary' : 'secondary'}
              onClick={() => setOrderType('delivery')}
            >
              <Icon name="truck" size={16} /> Delivery
            </Button>
          </div>
        </div>

        {orderType === 'delivery' && (
          <div className="ds-field">
            <label className="ds-label" htmlFor="deliveryAddress">Delivery address</label>
            <input
              id="deliveryAddress"
              className="input"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Street, apartment, city, zip"
            />
            <p className="ds-help">A small delivery fee is added at checkout.</p>
          </div>
        )}

        <div className="ds-field">
          <label className="ds-label" htmlFor="notes">Order notes (optional)</label>
          <textarea
            id="notes"
            className="input"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Spice level, allergies, or special requests"
          />
        </div>

        <div className="ds-form-actions">
          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Placing order...' : 'Place order'}
          </Button>
        </div>
      </form>
    </Section>
  );
}