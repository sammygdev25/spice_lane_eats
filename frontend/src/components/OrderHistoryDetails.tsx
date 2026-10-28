import { Section } from '../components/ui';
import { Icon } from '../components/icons';
import type { User } from '../types';

interface OrderHistoryDetailsProps {
  user: User | null;
}

export default function OrderHistoryDetails({ user }: OrderHistoryDetailsProps) {
  if (!user) {
    return null;
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  return (
    <Section
      narrow
      eyebrow="Your account"
      title="Account details"
      subtitle="The contact details on file for your Spice Lane orders."
    >
      <div className="ds-form">
        <div className="ds-form-row">
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="user" size={16} /> Name
            </span>
            <p>{user.name}</p>
          </div>
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="mail" size={16} /> Email
            </span>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="ds-form-row">
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="phone" size={16} /> Phone
            </span>
            <p>{user.phone || 'Not provided'}</p>
          </div>
          {memberSince && (
            <div className="ds-field">
              <span className="ds-label">
                <Icon name="calendar" size={16} /> Ordering with us since
              </span>
              <p>{memberSince}</p>
            </div>
          )}
        </div>
        <p className="ds-help">
          Need to update these details? Head to your <Icon name="settings" size={14} /> profile page to make changes.
        </p>
      </div>
    </Section>
  );
}