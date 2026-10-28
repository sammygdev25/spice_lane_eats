import { Section, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeCtaProps {
  section?: { title?: string; text?: string };
  page?: string;
}

export default function HomeCta({ section }: HomeCtaProps) {
  return (
    <Section tight>
      <div className="ds-card ds-card-body ds-between">
        <div>
          <h2 className="ds-card-title">
            {section?.title ?? 'Hungry? Spice Lane is plating it up now.'}
          </h2>
          <p className="ds-muted">
            {section?.text ??
              'Browse the full menu, build your order, and get it delivered or ready for pickup in minutes.'}
          </p>
        </div>
        <Button variant="primary" size="lg" to="/menu-items">
          View the Menu
          <Icon name="arrow-right" size={18} />
        </Button>
      </div>
    </Section>
  );
}