import { Section, Split, Card, CardBody } from '../components/ui';
import { Icon } from '../components/icons';
import type { IconName } from '../components/icons';

interface ValuePoint {
  icon: IconName;
  title: string;
  text: string;
}

interface HomeAboutProps {
  title?: string;
  story?: string;
  values?: ValuePoint[];
}

const DEFAULT_VALUES: ValuePoint[] = [
  {
    icon: 'sparkle',
    title: 'Bold, hand-ground spices',
    text: 'Every blend is roasted and ground fresh in-house, so each dish tastes like it just left a spice market.',
  },
  {
    icon: 'truck',
    title: 'Fast pickup & delivery',
    text: 'Order ahead and grab it on your way, or have it brought straight to your door while it is still hot.',
  },
  {
    icon: 'heart',
    title: 'Family recipes, honestly made',
    text: 'Our menu grew out of a home kitchen on Spice Lane — no shortcuts, just recipes passed down and perfected.',
  },
];

export default function HomeAbout({
  title = 'Our Story',
  story = "Spice Lane Eats started as a single stall on a street famous for its spice traders, where our founder served bold, home-style curries to anyone willing to wait in line. Today we bring that same stall's recipes to your table — fragrant rice bowls, slow-simmered curries, and street-food classics made fresh to order, whether you're eating in, picking up, or having it delivered.",
  values = DEFAULT_VALUES,
}: HomeAboutProps) {
  return (
    <Section eyebrow="About Us" title={title}>
      <Split>
        <div className="ds-stack">
          <p className="ds-lead">{story}</p>
          <p className="ds-muted">
            From our kitchen on Spice Lane to your table, every order is cooked fresh — no reheats,
            no shortcuts, just real food made with real spice.
          </p>
        </div>
        <div className="ds-stack">
          {values.map((value) => (
            <Card key={value.title}>
              <CardBody>
                <div className="ds-cluster">
                  <Icon name={value.icon} size={24} title={value.title} />
                  <div className="ds-stack" style={{ gap: 'var(--space-1, 4px)' }}>
                    <h3 className="ds-card-title">{value.title}</h3>
                    <p className="ds-muted">{value.text}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Split>
    </Section>
  );
}