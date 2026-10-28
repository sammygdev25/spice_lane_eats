import { Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Media, Button, Badge } from './ui';
import { Icon } from './icons';
import type { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const available = item.isAvailable !== false;

  return (
    <Card className="menu-item-card">
      <Media
        src={item.imageUrl ? `/img/${item.imageUrl}` : undefined}
        alt={item.name}
        ratio="wide"
        badge={!available ? <Badge tone="danger">Sold out</Badge> : undefined}
      />
      <CardBody>
        <CardTitle>{item.name}</CardTitle>
        {item.description && (
          <CardMeta>{item.description}</CardMeta>
        )}
        <CardFooter>
          <Price value={item.price} />
          <Button
            variant="primary"
            size="md"
            disabled={!available}
            onClick={() => onAddToCart(item)}
          >
            <Icon name="plus" size={16} />
            {available ? 'Add to cart' : 'Unavailable'}
          </Button>
        </CardFooter>
      </CardBody>
    </Card>
  );
}

export default MenuItemCard;
export { MenuItemCard };