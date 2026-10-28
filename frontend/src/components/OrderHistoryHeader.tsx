import { PageHeader } from '../components/ui';

interface OrderHistoryHeaderProps {
  userName?: string;
}

export default function OrderHistoryHeader({ userName }: OrderHistoryHeaderProps) {
  return (
    <PageHeader
      eyebrow="Spice Lane"
      title="Your Orders"
      subtitle={
        userName
          ? `Here's everything you've ordered from Spice Lane, ${userName}.`
          : "Here's everything you've ordered from Spice Lane."
      }
    />
  );
}