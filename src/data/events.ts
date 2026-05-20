import eventRock from "@/assets/event-rock.jpg";
import eventSports from "@/assets/event-sports.jpg";
import eventTheater from "@/assets/event-theater.jpg";
import eventPop from "@/assets/event-pop.jpg";
import eventEdm from "@/assets/event-edm.jpg";
import eventComedy from "@/assets/event-comedy.jpg";

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
  },
];

export const getEventById = (id: string) => events.find((e) => e.id === id);