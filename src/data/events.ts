import eventRock from "@/assets/event-rock.jpg";
import eventSports from "@/assets/event-sports.jpg";
import eventTheater from "@/assets/event-theater.jpg";
import eventPop from "@/assets/event-pop.jpg";
import eventEdm from "@/assets/event-edm.jpg";
import eventComedy from "@/assets/event-comedy.jpg";

export type TierId = "vip" | "lower" | "ga" | "upper";

export interface TierInventory {
  capacity: number;
  remaining: number;
}

export interface EventItem {
  id: string;
  image: string;
  title: string;
  date: string;
  venue: string;
  price: string;
  badge?: string;
  description: string;
  category: "Concerts" | "Sports" | "Theater" | "Comedy" | "Festivals";
  popularity: number; // 0-100
  /** Per-tier ticket inventory for this event. Drives the seating map. */
  inventory: Record<TierId, TierInventory>;
}

export const events: EventItem[] = [
  {
    id: "the-weeknd-after-hours",
    image: eventPop,
    title: "The Weeknd – After Hours World Tour",
    date: "Apr 12, 2026 • 8:00 PM",
    venue: "Madison Square Garden, NY",
    price: "$89",
    badge: "On Sale Now",
    description:
      "Experience The Weeknd live as he brings his After Hours World Tour to Madison Square Garden. A spectacular production with stunning visuals and unforgettable hits.",
    category: "Concerts",
    popularity: 96,
    inventory: {
      vip:   { capacity: 80,   remaining: 6 },
      lower: { capacity: 960,  remaining: 142 },
      ga:    { capacity: 400,  remaining: 88 },
      upper: { capacity: 1800, remaining: 612 },
    },
  },
  {
    id: "nba-lakers-celtics",
    image: eventSports,
    title: "NBA Playoffs – Lakers vs Celtics",
    date: "Apr 18, 2026 • 7:30 PM",
    venue: "Crypto.com Arena, LA",
    price: "$145",
    badge: "Low Tickets",
    description:
      "The greatest rivalry in basketball returns. Witness the Lakers and Celtics battle it out in this must-see playoff matchup.",
    category: "Sports",
    popularity: 92,
    inventory: {
      vip:   { capacity: 80,   remaining: 0 },
      lower: { capacity: 960,  remaining: 38 },
      ga:    { capacity: 0,    remaining: 0 },
      upper: { capacity: 1800, remaining: 214 },
    },
  },
  {
    id: "hamilton-broadway",
    image: eventTheater,
    title: "Hamilton – Broadway",
    date: "Apr 22, 2026 • 7:00 PM",
    venue: "Richard Rodgers Theatre, NY",
    price: "$199",
    description:
      "The story of America then, told by America now. Lin-Manuel Miranda's Tony-winning masterpiece on its original Broadway stage.",
    category: "Theater",
    popularity: 81,
    inventory: {
      vip:   { capacity: 40,  remaining: 4 },
      lower: { capacity: 600, remaining: 96 },
      ga:    { capacity: 0,   remaining: 0 },
      upper: { capacity: 700, remaining: 188 },
    },
  },
  {
    id: "foo-fighters-last-stand",
    image: eventRock,
    title: "Foo Fighters – The Last Stand Tour",
    date: "May 3, 2026 • 8:00 PM",
    venue: "Wembley Stadium, London",
    price: "$75",
    description:
      "Dave Grohl and the Foo Fighters take Wembley Stadium for one unforgettable night of stadium rock anthems.",
    category: "Concerts",
    popularity: 88,
    inventory: {
      vip:   { capacity: 120,  remaining: 22 },
      lower: { capacity: 1200, remaining: 410 },
      ga:    { capacity: 800,  remaining: 305 },
      upper: { capacity: 2400, remaining: 1180 },
    },
  },
  {
    id: "calvin-harris-summerfest",
    image: eventEdm,
    title: "Calvin Harris – Summerfest",
    date: "May 15, 2026 • 10:00 PM",
    venue: "Las Vegas Festival Grounds",
    price: "$120",
    badge: "Just Announced",
    description:
      "Calvin Harris headlines Summerfest with a massive open-air production featuring world-class lighting, lasers, and non-stop hits.",
    category: "Festivals",
    popularity: 84,
    inventory: {
      vip:   { capacity: 200,  remaining: 175 },
      lower: { capacity: 600,  remaining: 540 },
      ga:    { capacity: 3000, remaining: 2480 },
      upper: { capacity: 0,    remaining: 0 },
    },
  },
  {
    id: "john-mulaney-chicago",
    image: eventComedy,
    title: "John Mulaney – Live in Chicago",
    date: "May 20, 2026 • 9:00 PM",
    venue: "Chicago Theatre, IL",
    price: "$65",
    description:
      "Emmy-winning comedian John Mulaney returns to his hometown for a night of brand-new stand-up at the historic Chicago Theatre.",
    category: "Comedy",
    popularity: 73,
    inventory: {
      vip:   { capacity: 30,  remaining: 2 },
      lower: { capacity: 500, remaining: 64 },
      ga:    { capacity: 0,   remaining: 0 },
      upper: { capacity: 900, remaining: 312 },
    },
  },
  {
    id: "taylor-swift-eras-encore",
    image: eventPop,
    title: "Taylor Swift – The Eras Encore",
    date: "Jun 4, 2026 • 7:00 PM",
    venue: "SoFi Stadium, LA",
    price: "$249",
    badge: "Best Seller",
    description:
      "Taylor Swift returns for a limited Eras Encore run. Every era, every anthem, one unforgettable night under the SoFi lights.",
    category: "Concerts",
    popularity: 99,
    inventory: {
      vip:   { capacity: 200,  remaining: 8 },
      lower: { capacity: 2400, remaining: 96 },
      ga:    { capacity: 1200, remaining: 42 },
      upper: { capacity: 4000, remaining: 510 },
    },
  },
  {
    id: "f1-miami-grand-prix",
    image: eventSports,
    title: "Formula 1 – Miami Grand Prix",
    date: "Jun 14, 2026 • 3:30 PM",
    venue: "Miami International Autodrome",
    price: "$320",
    badge: "Limited",
    description:
      "Three days of high-octane racing on the streets of Miami Gardens. Paddock access, grandstand seating, and live concerts every night.",
    category: "Sports",
    popularity: 90,
    inventory: {
      vip:   { capacity: 150,  remaining: 24 },
      lower: { capacity: 1800, remaining: 220 },
      ga:    { capacity: 5000, remaining: 1840 },
      upper: { capacity: 0,    remaining: 0 },
    },
  },
  {
    id: "phantom-of-the-opera",
    image: eventTheater,
    title: "The Phantom of the Opera",
    date: "Jun 22, 2026 • 7:30 PM",
    venue: "Her Majesty's Theatre, London",
    price: "$130",
    description:
      "Andrew Lloyd Webber's timeless masterpiece returns to the West End in a stunning new staging of love, obsession, and music.",
    category: "Theater",
    popularity: 78,
    inventory: {
      vip:   { capacity: 40,  remaining: 6 },
      lower: { capacity: 700, remaining: 142 },
      ga:    { capacity: 0,   remaining: 0 },
      upper: { capacity: 900, remaining: 268 },
    },
  },
  {
    id: "coachella-weekend-one",
    image: eventEdm,
    title: "Coachella – Weekend One",
    date: "Jul 10, 2026 • 12:00 PM",
    venue: "Empire Polo Club, Indio",
    price: "$549",
    badge: "Festival",
    description:
      "Three days, six stages, 150+ artists. The desert's biggest celebration of music, art, and culture returns for another iconic weekend.",
    category: "Festivals",
    popularity: 94,
    inventory: {
      vip:   { capacity: 800,  remaining: 92 },
      lower: { capacity: 0,    remaining: 0 },
      ga:    { capacity: 12000,remaining: 3120 },
      upper: { capacity: 0,    remaining: 0 },
    },
  },
  {
    id: "kevin-hart-reality-check",
    image: eventComedy,
    title: "Kevin Hart – Reality Check Tour",
    date: "Jul 25, 2026 • 8:30 PM",
    venue: "Barclays Center, Brooklyn",
    price: "$95",
    description:
      "Kevin Hart brings his sharpest material yet to Barclays Center for one night of laugh-out-loud, no-holds-barred stand-up.",
    category: "Comedy",
    popularity: 82,
    inventory: {
      vip:   { capacity: 60,   remaining: 11 },
      lower: { capacity: 1200, remaining: 248 },
      ga:    { capacity: 0,    remaining: 0 },
      upper: { capacity: 2200, remaining: 690 },
    },
  },
  {
    id: "metallica-m72-world-tour",
    image: eventRock,
    title: "Metallica – M72 World Tour",
    date: "Aug 8, 2026 • 7:30 PM",
    venue: "MetLife Stadium, NJ",
    price: "$110",
    badge: "On Sale Now",
    description:
      "Two nights, two completely different setlists, one in-the-round stage. Metallica's M72 World Tour roars into MetLife Stadium.",
    category: "Concerts",
    popularity: 87,
    inventory: {
      vip:   { capacity: 180,  remaining: 34 },
      lower: { capacity: 2000, remaining: 612 },
      ga:    { capacity: 1500, remaining: 480 },
      upper: { capacity: 3500, remaining: 1820 },
    },
  },
];

export const getEventById = (id: string) => events.find((e) => e.id === id);