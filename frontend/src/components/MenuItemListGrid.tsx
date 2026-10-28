import type { MenuItem } from '../types';
import { Section, Grid, Card, CardBody, CardTitle, CardMeta, Price, Badge, Media, SkeletonCards, EmptyState, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface MenuItemListGridProps {
  items: MenuItem[];
  loading?: boolean;
  onAddToCart: (item: MenuItem) => void;
  onClearFilters?: () => void;
}

export default function MenuItemListGrid({ items, loading, onAddToCart, onClearFilters }: MenuItemListGridProps) {
  if (loading) {
    return (
      <Section tight>
        <SkeletonCards count={6} />
      </Section>
    );
  }

  if (items.length === 0) {
    return (
      <Section tight>
        <EmptyState
          icon="package"
          title="No dishes found"
          text="We couldn't find anything matching your search. Try a different category or clear your filters to see the full Spice Lane menu."
          action={
            onClearFilters ? (
              <Button variant="primary" onClick={onClearFilters}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      </Section>
    );
  }

  return (
    <Section tight>
      <Grid size="md" cols={3}>
        {items.map((item) => (
          <Card key={item.id}>
            <Media
              src={item.imageUrl}
              alt={item.name}
              ratio="wide"
              badge={
                !item.isAvailable ? (
                  <Badge tone="danger">Sold out</Badge>
                ) : item.category?.name ? (
                  <Badge tone="soft">{item.category?.name}</Badge>
                ) : undefined
              }
            />
            <CardBody>
              <CardTitle>{item.name}</CardTitle>
              {item.description && <CardMeta>{item.description}</CardMeta>}
              <div className="ds-between">
                <Price value={item.price} />
                <Button
                  variant="primary"
                  size="md"
                  disabled={!item.isAvailable}
                  onClick={() => onAddToCart(item)}
                >
                  <Icon name="cart" size={16} /> Add
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}