import { PageHeader } from '../components/ui';

interface MenuItemListHeaderProps {
  resultCount?: number;
  loading?: boolean;
}

export default function MenuItemListHeader({ resultCount, loading }: MenuItemListHeaderProps) {
  const subtitle = loading
    ? 'Loading our menu...'
    : typeof resultCount === 'number'
    ? `${resultCount} ${resultCount === 1 ? 'dish' : 'dishes'} ready to order`
    : 'Fresh, bold flavors from Spice Lane\'s kitchen to your table';

  return (
    <PageHeader
      eyebrow="Spice Lane Menu"
      title="Our Full Menu"
      subtitle={subtitle}
    />
  );
}