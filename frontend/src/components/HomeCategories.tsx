import { Link } from 'react-router-dom';
import { Section, Grid, Card, CardBody, CardTitle } from '../components/ui';
import { Icon } from '../components/icons';
import type { Category } from '../types';

interface HomeCategoriesProps {
  categories: Category[];
}

export default function HomeCategories({ categories }: HomeCategoriesProps) {
  if (!categories || categories.length === 0) {
    return (
      <Section
        eyebrow="How it works"
        title="Getting your Spice Lane fix is easy"
        subtitle="Order ahead and skip the wait, every time."
      >
        <Grid size="sm" cols={3}>
          <Card>
            <CardBody>
              <Icon name="book" size={28} />
              <CardTitle>Browse the menu</CardTitle>
              <p className="ds-muted">Explore our dishes, from fiery curries to cooling sides.</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Icon name="cart" size={28} />
              <CardTitle>Build your order</CardTitle>
              <p className="ds-muted">Add favorites to your cart and choose pickup or delivery.</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Icon name="truck" size={28} />
              <CardTitle>Get it fresh</CardTitle>
              <p className="ds-muted">We fire it up and send it your way, hot off the stove.</p>
            </CardBody>
          </Card>
        </Grid>
      </Section>
    );
  }

  return (
    <Section
      eyebrow="Browse by category"
      title="Find your flavor"
      subtitle="From street-food starters to slow-simmered mains, Spice Lane has it sorted."
    >
      <Grid size="sm" cols={3}>
        {categories.map((category) => (
          <Card key={category.id} to={`/menu-items?category=${category.id}`}>
            <CardBody>
              <Icon name="tag" size={24} />
              <CardTitle>{category.name}</CardTitle>
              <p className="ds-muted">
                <Link to={`/menu-items?category=${category.id}`}>Shop {category.name}</Link>
              </p>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}