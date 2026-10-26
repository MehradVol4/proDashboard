/**
 * Fills a fresh database with enough to exercise every screen: cabins with real
 * photos, guests, and bookings spread across the past, today and the future so
 * the dashboard, check-in list and today's activity all have something to show.
 *
 * Safe to re-run: it clears the booking/guest/cabin tables first. The admin
 * user and the settings row are upserted, so a changed password survives.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@prodashboard.local';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'password1234';

// The sample photos already live in the React app; copy them into the API's
// upload folder so the seeded cabins point at this server, not at Supabase.
function copyCabinImages() {
  // In Docker the React app's folder is not around, so the image directory is
  // overridable.
  const source =
    process.env.SEED_IMAGES_DIR || join(process.cwd(), '..', 'src', 'data', 'cabins');
  const target = join(process.cwd(), 'uploads');

  if (!existsSync(target)) mkdirSync(target, { recursive: true });
  if (!existsSync(source)) {
    console.warn(`[seed] no cabin images at ${source}; cabins will have none`);
    return false;
  }

  for (const file of readdirSync(source)) {
    if (/\.(jpe?g|png|webp)$/i.test(file))
      copyFileSync(join(source, file), join(target, file));
  }

  return true;
}

const cabins = [
  { name: '001', maxCapacity: 2, regularPrice: 250, discount: 0, description: 'A cozy wooden cabin for couples, tucked into the forest with a fireplace, a king-size bed and a private deck with a hot tub.' },
  { name: '002', maxCapacity: 2, regularPrice: 350, discount: 25, description: 'A romantic hideaway with floor-to-ceiling windows, a wood-burning stove and uninterrupted views of the valley below.' },
  { name: '003', maxCapacity: 4, regularPrice: 300, discount: 0, description: 'A family-sized cabin with two bedrooms, a full kitchen and a long table built for slow breakfasts.' },
  { name: '004', maxCapacity: 4, regularPrice: 500, discount: 50, description: 'A light-filled retreat with a mezzanine bedroom, a reading nook and a sauna at the edge of the trees.' },
  { name: '005', maxCapacity: 6, regularPrice: 350, discount: 0, description: 'A roomy lodge for groups, with bunk space for the children and a fire pit out front.' },
  { name: '006', maxCapacity: 6, regularPrice: 800, discount: 100, description: 'The grand cabin: three bedrooms, a chef kitchen, a wraparound deck and a view of the lake.' },
  { name: '007', maxCapacity: 8, regularPrice: 600, discount: 0, description: 'Built for two families, with a shared living room and a long veranda facing the sunset.' },
  { name: '008', maxCapacity: 10, regularPrice: 1400, discount: 200, description: 'The largest cabin on the property, with its own dining hall, games room and private jetty.' },
];

const guests = [
  { fullName: 'Jonas Schmedtmann', email: 'hello@jonas.io', nationality: 'Portugal', nationalID: '3525436345', countryFlag: 'https://flagcdn.com/pt.svg' },
  { fullName: 'Jonathan Smith', email: 'johnsmith@test.eu', nationality: 'Great Britain', nationalID: '4534593454', countryFlag: 'https://flagcdn.com/gb.svg' },
  { fullName: 'Jonatan Johansson', email: 'jonatan@example.com', nationality: 'Finland', nationalID: '9374074454', countryFlag: 'https://flagcdn.com/fi.svg' },
  { fullName: 'Jonas Mueller', email: 'jonas@example.eu', nationality: 'Germany', nationalID: '1233212288', countryFlag: 'https://flagcdn.com/de.svg' },
  { fullName: 'Fatima Al-Sayed', email: 'fatima@example.ae', nationality: 'United Arab Emirates', nationalID: '8372615243', countryFlag: 'https://flagcdn.com/ae.svg' },
  { fullName: 'Farrukh Ahmadov', email: 'farrukh@example.az', nationality: 'Azerbaijan', nationalID: '2847562934', countryFlag: 'https://flagcdn.com/az.svg' },
  { fullName: 'Maria Rodriguez', email: 'maria@example.es', nationality: 'Spain', nationalID: '5647382910', countryFlag: 'https://flagcdn.com/es.svg' },
  { fullName: 'Marco Rossi', email: 'marco@example.it', nationality: 'Italy', nationalID: '9182736450', countryFlag: 'https://flagcdn.com/it.svg' },
  { fullName: 'Emma Watson', email: 'emma@example.co.uk', nationality: 'Great Britain', nationalID: '1029384756', countryFlag: 'https://flagcdn.com/gb.svg' },
  { fullName: 'Emmanuel Okafor', email: 'emmanuel@example.ng', nationality: 'Nigeria', nationalID: '5738291046', countryFlag: 'https://flagcdn.com/ng.svg' },
  { fullName: 'Ahmed Hassan', email: 'ahmed@example.eg', nationality: 'Egypt', nationalID: '8273645190', countryFlag: 'https://flagcdn.com/eg.svg' },
  { fullName: 'Anika Sharma', email: 'anika@example.in', nationality: 'India', nationalID: '6758493021', countryFlag: 'https://flagcdn.com/in.svg' },
  { fullName: 'Sofia Lindqvist', email: 'sofia@example.se', nationality: 'Sweden', nationalID: '3344556677', countryFlag: 'https://flagcdn.com/se.svg' },
  { fullName: 'Lucas Oliveira', email: 'lucas@example.br', nationality: 'Brazil', nationalID: '7788990011', countryFlag: 'https://flagcdn.com/br.svg' },
  { fullName: 'Yuki Tanaka', email: 'yuki@example.jp', nationality: 'Japan', nationalID: '2233445566', countryFlag: 'https://flagcdn.com/jp.svg' },
  { fullName: 'Chloe Dubois', email: 'chloe@example.fr', nationality: 'France', nationalID: '9900112233', countryFlag: 'https://flagcdn.com/fr.svg' },
  { fullName: 'Liam Murphy', email: 'liam@example.ie', nationality: 'Ireland', nationalID: '4455667788', countryFlag: 'https://flagcdn.com/ie.svg' },
  { fullName: 'Noor Haddad', email: 'noor@example.jo', nationality: 'Jordan', nationalID: '6677889900', countryFlag: 'https://flagcdn.com/jo.svg' },
  { fullName: 'Elena Petrova', email: 'elena@example.bg', nationality: 'Bulgaria', nationalID: '1122334455', countryFlag: 'https://flagcdn.com/bg.svg' },
  { fullName: 'Daniel Kim', email: 'daniel@example.kr', nationality: 'South Korea', nationalID: '5566778899', countryFlag: 'https://flagcdn.com/kr.svg' },
];

const OBSERVATIONS = [
  '',
  'I have a gluten allergy and would like a gluten-free breakfast.',
  'Arriving late, probably after 10pm.',
  'Celebrating an anniversary — any chance of flowers in the room?',
  'Travelling with a small dog, as agreed on the phone.',
  '',
  'Please can we have a cot for the baby?',
  '',
];

function dayFromToday(offset: number) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offset);
  return date;
}

function statusFor(startOffset: number, endOffset: number) {
  if (endOffset < 0) return 'checked-out';
  if (startOffset <= 0 && endOffset >= 0) return 'checked-in';
  return 'unconfirmed';
}

// Deterministic pseudo-randomness, so re-seeding produces the same data.
function pick<T>(list: T[], index: number) {
  return list[index % list.length];
}

async function main() {
  const hasImages = copyCabinImages();

  console.log('[seed] clearing bookings, guests and cabins');
  await prisma.booking.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.cabin.deleteMany();

  console.log('[seed] creating cabins');
  const createdCabins = [];
  for (const cabin of cabins) {
    createdCabins.push(
      await prisma.cabin.create({
        data: {
          ...cabin,
          image: hasImages
            ? `${PUBLIC_URL}/uploads/cabin-${cabin.name}.jpg`
            : null,
        },
      }),
    );
  }

  console.log('[seed] creating guests');
  const createdGuests = [];
  for (const guest of guests) {
    createdGuests.push(await prisma.guest.create({ data: guest }));
  }

  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      minBookingLength: 1,
      maxBookingLength: 90,
      maxGuestPerBooking: 8,
      breakfastPrice: 15,
      hotelName: 'The Wild Oasis',
      currency: 'USD',
      locale: 'en',
      taxRate: 0,
      checkInTime: '15:00',
      checkOutTime: '11:00',
      cancellationPolicy:
        'Free cancellation up to 7 days before arrival. After that, the first night is charged.',
    },
  });

  console.log('[seed] creating bookings');

  // A spread of stays: finished, in progress, arriving today, leaving today,
  // and upcoming — so every dashboard panel has data.
  const schedule: Array<[number, number]> = [
    [-58, -52], [-47, -44], [-40, -33], [-31, -28], [-24, -17],
    [-15, -12], [-9, -4], [-6, -1], [-3, 2], [-2, 0],
    [-5, 0], [0, 4], [0, 7], [0, 3], [1, 6],
    [2, 9], [4, 8], [6, 13], [9, 12], [11, 18],
    [14, 21], [17, 20], [21, 28], [25, 31],
  ];

  let index = 0;
  for (const [startOffset, endOffset] of schedule) {
    const cabin = pick(createdCabins, index * 3 + 1);
    const guest = pick(createdGuests, index * 7 + 2);

    const startDate = dayFromToday(startOffset);
    const endDate = dayFromToday(endOffset);
    const numNights = Math.max(endOffset - startOffset, 1);
    const numGuests = Math.min(1 + (index % cabin.maxCapacity), cabin.maxCapacity);

    const hasBreakfast = index % 3 === 0;
    const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
    const extrasPrice = hasBreakfast
      ? numNights * settings.breakfastPrice * numGuests
      : 0;

    const status = statusFor(startOffset, endOffset);

    await prisma.booking.create({
      data: {
        created_at: dayFromToday(startOffset - 20),
        startDate,
        endDate,
        numNights,
        numGuests,
        cabinPrice,
        extrasPrice,
        totalPrice: cabinPrice + extrasPrice,
        status,
        hasBreakfast,
        isPaid: status !== 'unconfirmed',
        observations: pick(OBSERVATIONS, index),
        cabinId: cabin.id,
        guestId: guest.id,
      },
    });

    index += 1;
  }

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      fullName: 'Hotel Admin',
      password: await bcrypt.hash(ADMIN_PASSWORD, 10),
    },
  });

  console.log('');
  console.log(`[seed] done: ${createdCabins.length} cabins, ${createdGuests.length} guests, ${schedule.length} bookings`);
  console.log(`[seed] log in with ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log('');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
