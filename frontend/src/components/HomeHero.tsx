import { Hero, Button, Media } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeHeroProps {
  imageUrl?: string;
}

export default function HomeHero({ imageUrl = '/img/brand/hero.jpg' }: HomeHeroProps) {
  return (
    <Hero
      eyebrow="Spice Lane Kitchen"
      title="Bold flavors, delivered hot and fast"
      text="From sizzling curries to street-food favorites, Spice Lane brings our scratch-made menu straight to your door. Order online for pickup or delivery and skip the wait."
      actions={
        <>
          <Button variant="primary" size="lg" to="/menu-items">
            View Menu
          </Button>
          <Button variant="ghost" size="lg" to="/menu-items">
            <Icon name="truck" size={18} />
            Order for Delivery
          </Button>
        </>
      }
      media={imageUrl ? <Media src={imageUrl} alt="Spice Lane signature dish" ratio="wide" /> : undefined}
    />
  );
}