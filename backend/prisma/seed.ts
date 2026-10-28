import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // A seeded database is never seeded twice (the image runs this on every boot with SEED_DEMO=1).
  if ((await prisma.user.count()) > 0 && process.env.SEED_FORCE !== '1') {
    console.log('Seed skipped: the database already has users (SEED_FORCE=1 seeds anyway).');
    return;
  }

  // Create demo user
  // The demo password is this project's own (SEED_DEMO_PASSWORD in backend/.env, made at generation, never shipped):
  // no generated app shares a known password. Without it there are no demo accounts and no demo data.
  const demoPassword = process.env.SEED_DEMO_PASSWORD || '';
  if (!demoPassword) {
    console.warn('[seed] SEED_DEMO_PASSWORD is not set: no demo accounts and no demo data.');
    return;
  }
  const hashedPassword = await bcrypt.hash(demoPassword, 10);
  await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: { isStaff: true },
    create: {
      isStaff: true,
      username: 'demo',
      email: 'demo@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
    },
  });

  // Create demo staff user (staff, the same demo password)
  await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      username: 'staff',
      email: 'staff@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'Staff',
      isStaff: true,
      role: 'staff',
    },
  });

  // Domain seed data
  const ids: Record<string, number[]> = {};
  const pick = (list: number[] | undefined, n: number): number => (list && list.length ? list[(n - 1) % list.length] : n);
  ids.User = (await prisma.user.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  try {
    await prisma.category.create({ data: { name: 'Appetizers', displayOrder: 1 } });
    await prisma.category.create({ data: { name: 'Soups & Salads', displayOrder: 2 } });
    await prisma.category.create({ data: { name: 'Tandoori Specialties', displayOrder: 3 } });
    await prisma.category.create({ data: { name: 'Curries', displayOrder: 4 } });
    ids.Category = (await prisma.category.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] Category skipped:', e); }
  try {
    await prisma.menuItem.create({ data: { name: 'Crispy Vegetable Samosas', description: 'Golden pastry pockets stuffed with spiced potatoes and peas, served with tamarind chutney.', price: 8.50, categoryId: pick(ids.Category, 1), imageUrl: '/img/menu_items/crispy-vegetable-samosas.jpg', isAvailable: true } });
    await prisma.menuItem.create({ data: { name: 'Tomato Shorba', description: 'Light and tangy tomato soup simmered with cumin and fresh cilantro.', price: 12.00, categoryId: pick(ids.Category, 2), imageUrl: '/img/menu_items/tomato-shorba.jpg', isAvailable: true } });
    await prisma.menuItem.create({ data: { name: 'Tandoori Chicken Half', description: 'Yogurt-marinated chicken roasted in a clay oven with smoky Kashmiri chili spice.', price: 9.75, categoryId: pick(ids.Category, 3), imageUrl: '/img/menu_items/tandoori-chicken-half.jpg', isAvailable: true } });
    await prisma.menuItem.create({ data: { name: 'Butter Chicken', description: 'Tender chicken simmered in a creamy tomato and butter sauce with fenugreek.', price: 14.50, categoryId: pick(ids.Category, 4), imageUrl: '/img/menu_items/butter-chicken.jpg', isAvailable: true } });
    await prisma.menuItem.create({ data: { name: 'Hyderabadi Chicken Biryani', description: 'Fragrant basmati rice layered with marinated chicken, saffron, and fried onions.', price: 6.25, categoryId: pick(ids.Category, 5), imageUrl: '/img/menu_items/hyderabadi-chicken-biryani.jpg', isAvailable: true } });
    await prisma.menuItem.create({ data: { name: 'Garlic Naan', description: 'Soft leavened flatbread brushed with garlic butter, baked fresh in the tandoor.', price: 11.00, categoryId: pick(ids.Category, 6), imageUrl: '/img/menu_items/garlic-naan.jpg', isAvailable: true } });
    await prisma.menuItem.create({ data: { name: 'Pani Puri', description: 'Crispy hollow puris filled with spiced potato and tangy mint-tamarind water.', price: 15.75, categoryId: pick(ids.Category, 7), imageUrl: '/img/menu_items/pani-puri.jpg', isAvailable: true } });
    await prisma.menuItem.create({ data: { name: 'Paneer Tikka Masala', description: 'Grilled paneer cubes tossed in a rich, spiced tomato and cashew gravy.', price: 7.50, categoryId: pick(ids.Category, 8), imageUrl: '/img/menu_items/paneer-tikka-masala.jpg', isAvailable: true } });
    await prisma.menuItem.create({ data: { name: 'Gulab Jamun', description: 'Warm milk dumplings soaked in rose-scented sugar syrup, served with pistachio.', price: 13.25, categoryId: pick(ids.Category, 9), imageUrl: '/img/menu_items/gulab-jamun.jpg', isAvailable: true } });
    await prisma.menuItem.create({ data: { name: 'Mango Lassi', description: 'Chilled yogurt smoothie blended with ripe mango pulp and a hint of cardamom.', price: 10.00, categoryId: pick(ids.Category, 10), imageUrl: '/img/menu_items/mango-lassi.jpg', isAvailable: true } });
    ids.MenuItem = (await prisma.menuItem.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] MenuItem skipped:', e); }
  try {
    await prisma.order.create({ data: { userId: pick(ids.User, 1), customerName: 'Priya Nair', phone: '312-555-0148', orderType: 'delivery', deliveryAddress: '482 Westfield Ave, Apt 3B, Chicago, IL', deliveryFee: 8.50, notes: 'Please ring doorbell twice, leave at door.', totalAmount: 24.50, status: 'pending', paidAt: new Date() } });
    await prisma.order.create({ data: { userId: pick(ids.User, 2), customerName: 'Marcus Bell', phone: '773-555-0192', orderType: 'pickup', deliveryAddress: '123 Main St, City 2', deliveryFee: 12.00, notes: 'Extra spicy, no onions please.', totalAmount: 38.00, status: 'paid', paidAt: new Date() } });
    await prisma.order.create({ data: { userId: pick(ids.User, 3), customerName: 'Anjali Desai', phone: '630-555-0177', orderType: 'delivery 3', deliveryAddress: '19 Orchard Lane, Naperville, IL', deliveryFee: 9.75, notes: 'Call upon arrival, gated community.', totalAmount: 17.25, status: 'preparing', paidAt: new Date() } });
    await prisma.order.create({ data: { userId: pick(ids.User, 4), customerName: 'Tom Richardson', phone: '847-555-0163', orderType: 'pickup 4', deliveryAddress: '123 Main St, City 4', deliveryFee: 14.50, notes: 'Order for 6:30pm, birthday dinner.', totalAmount: 52.75, status: 'completed', paidAt: new Date() } });
    await prisma.order.create({ data: { userId: pick(ids.User, 5), customerName: 'Sana Qureshi', phone: '312-555-0129', orderType: 'delivery 5', deliveryAddress: '77 Lakeshore Dr, Unit 12, Chicago, IL', deliveryFee: 6.25, notes: 'No cilantro in any dish.', totalAmount: 29.00, status: 'cancelled', paidAt: new Date() } });
    await prisma.order.create({ data: { userId: pick(ids.User, 6), customerName: 'David Kim', phone: '708-555-0115', orderType: 'pickup 6', deliveryAddress: '123 Main St, City 6', deliveryFee: 11.00, notes: 'Will arrive 15 minutes late.', totalAmount: 44.50, status: 'pending', paidAt: new Date() } });
    await prisma.order.create({ data: { userId: pick(ids.User, 7), customerName: 'Fatima Ali', phone: '224-555-0184', orderType: 'delivery 7', deliveryAddress: '305 Maple St, Evanston, IL', deliveryFee: 15.75, notes: 'Leave with doorman, allergic to peanuts.', totalAmount: 21.75, status: 'paid', paidAt: new Date() } });
    await prisma.order.create({ data: { userId: pick(ids.User, 8), customerName: 'Carlos Mendez', phone: '312-555-0161', orderType: 'pickup 8', deliveryAddress: '123 Main St, City 8', deliveryFee: 7.50, notes: 'Need extra napkins and plastic cutlery.', totalAmount: 33.00, status: 'preparing', paidAt: new Date() } });
    await prisma.order.create({ data: { userId: pick(ids.User, 9), customerName: 'Rina Patel', phone: '773-555-0138', orderType: 'delivery 9', deliveryAddress: '940 Sunset Blvd, Oak Park, IL', deliveryFee: 13.25, notes: 'Mild spice level for kids.', totalAmount: 61.25, status: 'completed', paidAt: new Date() } });
    await prisma.order.create({ data: { userId: pick(ids.User, 10), customerName: 'James O\'Connor', phone: '630-555-0199', orderType: 'pickup 10', deliveryAddress: '123 Main St, City 10', deliveryFee: 10.00, notes: 'Paid online, just needs bag ready.', totalAmount: 26.50, status: 'cancelled', paidAt: new Date() } });
    ids.Order = (await prisma.order.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] Order skipped:', e); }
  try {
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 1), menuItemId: pick(ids.MenuItem, 1), quantity: 1, price: 8.50 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 2), menuItemId: pick(ids.MenuItem, 2), quantity: 2, price: 12.00 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 3), menuItemId: pick(ids.MenuItem, 3), quantity: 3, price: 9.75 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 4), menuItemId: pick(ids.MenuItem, 4), quantity: 4, price: 14.50 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 5), menuItemId: pick(ids.MenuItem, 5), quantity: 1, price: 6.25 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 6), menuItemId: pick(ids.MenuItem, 6), quantity: 2, price: 11.00 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 7), menuItemId: pick(ids.MenuItem, 7), quantity: 3, price: 15.75 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 8), menuItemId: pick(ids.MenuItem, 8), quantity: 4, price: 7.50 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 9), menuItemId: pick(ids.MenuItem, 9), quantity: 1, price: 13.25 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 10), menuItemId: pick(ids.MenuItem, 10), quantity: 2, price: 10.00 } });
    ids.OrderItem = (await prisma.orderItem.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] OrderItem skipped:', e); }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
