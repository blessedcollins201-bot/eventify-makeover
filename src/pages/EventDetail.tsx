import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Accessibility,
  BadgeCheck,
  Calendar,
  Check,
  Clock,
  CreditCard,
  Download,
  Film,
  HelpCircle,
  Info,
  MapPin,
  Minus,
  Music2,
  Navigation,
  ParkingCircle,
  Play,
  Plus,
  Share2,
  ShieldCheck,
  Star,
  Sparkles,
  Ticket,
  Train,
  Utensils,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { events, getEventById } from "@/data/events";
import SeatingMap from "@/components/SeatingMap";
import EventCard from "@/components/EventCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

interface SeatTier {
  id: string;
  name: string;
  description: string;
  price: number;
  remaining: number;
}

const tiers: (SeatTier & { color: string })[] = [
  { id: "vip", name: "VIP Package", description: "Pit access + early entry + merch", price: 349, remaining: 12, color: "hsl(330 81% 60%)" },
  { id: "lower", name: "Lower Bowl", description: "Sections 101–115 • Reserved seating", price: 165, remaining: 38, color: "hsl(213 97% 44%)" },
  { id: "ga", name: "General Admission", description: "Standing floor access", price: 89, remaining: 142, color: "hsl(160 84% 39%)" },
  { id: "upper", name: "Upper Deck", description: "Sections 301–319 • Best value", price: 65, remaining: 220, color: "hsl(38 92% 50%)" },
];

const SERVICE_FEE_RATE = 0.18;

const videoClips = [
  { title: "Official Trailer", duration: "2:14", tag: "Watch first" },
  { title: "Behind the Scenes", duration: "4:02", tag: "Exclusive" },
  { title: "Last Tour Highlights", duration: "3:28", tag: "Fan favorite" },
  { title: "Venue Walk-Through", duration: "1:47", tag: "New" },
];

const fanReels = [
  { handle: "@nyc_lights", caption: "Floor 4 — unreal energy 🔥" },
  { handle: "@maya.beats", caption: "Encore moment, goosebumps" },
  { handle: "@sebastian", caption: "Best opening I've seen all year" },
  { handle: "@raelynn", caption: "Pyro + lasers = chef's kiss" },
];

const eventStats = [
  { icon: Users, label: "Attending", value: "18.4k" },
  { icon: Clock, label: "Run time", value: "~2h 30m" },
  { icon: Music2, label: "Setlist", value: "26 songs" },
  { icon: Sparkles, label: "Production", value: "4K visuals" },
];

const sectionNav = [
  { id: "overview", label: "Overview" },
  { id: "media", label: "Watch" },
  { id: "lineup", label: "Lineup" },
  { id: "seats", label: "Seats" },
  { id: "venue", label: "Venue" },
  { id: "know", label: "Know before" },
  { id: "faq", label: "FAQ" },
  { id: "related", label: "Related" },
];

const lineup = [
  { name: "Headliner", role: "Main act", time: "9:30 PM", duration: "90 min" },
  { name: "Special Guest", role: "Direct support", time: "8:30 PM", duration: "45 min" },
  { name: "Opening Act", role: "Opener", time: "7:45 PM", duration: "30 min" },
];

const knowBeforeYouGo = [
  { icon: Ticket, title: "Mobile tickets only", body: "Tickets are delivered to your wallet 24h before doors." },
  { icon: BadgeCheck, title: "Age policy", body: "All ages welcome. Under 16 must be accompanied by an adult." },
  { icon: ShieldCheck, title: "Bag policy", body: "Clear bags up to 12\"×6\"×12\" or small clutches only." },
  { icon: Accessibility, title: "Accessible seating", body: "Step-free routes, ASL on request, sensory kits at guest services." },
];

const venueAmenities = [
  { icon: Train, label: "Transit", value: "2 lines · 3 min walk" },
  { icon: ParkingCircle, label: "Parking", value: "4 garages within 0.3 mi" },
  { icon: Utensils, label: "Food & drink", value: "22 vendors on-site" },
  { icon: Accessibility, label: "Accessibility", value: "Fully ADA compliant" },
];

const faqs = [
  { q: "When do doors open?", a: "Doors open 90 minutes before showtime. We recommend arriving early to avoid lines at security." },
  { q: "What's the refund policy?", a: "All sales are final, but tickets are 100% guaranteed. If the event is cancelled, you'll receive an automatic refund within 14 days." },
  { q: "Can I transfer my tickets?", a: "Yes — you can transfer mobile tickets to anyone with a free account directly from your order." },
  { q: "What items are prohibited?", a: "Professional cameras, outside food and drink, laser pointers, and large bags. See the venue page for the full list." },
  { q: "Is re-entry allowed?", a: "Re-entry is not permitted once you've entered the venue, except for medical emergencies." },
];

const reviews = [
  { name: "Jordan P.", rating: 5, body: "The production was on another level. Worth every penny." },
  { name: "Priya S.", rating: 5, body: "Sound was crisp from the upper deck — incredible value." },
  { name: "Marcus T.", rating: 4, body: "Crowd was electric. Lines for drinks were long though." },
];

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const event = id ? getEventById(id) : undefined;
  const [tierId, setTierId] = useState<string>("lower");
  const [qty, setQty] = useState(2);
  const [activeSection, setActiveSection] = useState<string>("overview");

  const tier = useMemo(() => tiers.find((t) => t.id === tierId)!, [tierId]);
  const subtotal = tier.price * qty;
  const fees = subtotal * SERVICE_FEE_RATE;
  const total = subtotal + fees;

  // Track which section is in view for the sticky nav
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sectionNav.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [event?.id]);

  const relatedEvents = useMemo(() => {
    if (!event) return [];

    const cityOf = (venue: string) =>
      venue.split(",").pop()?.trim().toLowerCase() ?? "";
    const parseDate = (d: string) => {
      const t = Date.parse(d.split("•")[0].trim());
      return Number.isNaN(t) ? 0 : t;
    };

    const baseCity = cityOf(event.venue);
    const baseDate = parseDate(event.date);

    return events
      .filter((e) => e.id !== event.id)
      .map((e) => {
        const sameCategory = e.category === event.category;
        const sameCity = cityOf(e.venue) === baseCity;
        const daysApart = baseDate
          ? Math.abs(parseDate(e.date) - baseDate) / 86400000
          : 365;
        // closer in time scores higher (1.0 same day → ~0 at 180d)
        const proximity = Math.max(0, 1 - daysApart / 180);
        const popularity = (e.popularity ?? 50) / 100;

        const score =
          (sameCategory ? 5 : 0) +
          (sameCity ? 2.5 : 0) +
          proximity * 2 +
          popularity * 1.5;

        const reasons: string[] = [];
        if (sameCategory) reasons.push(`More ${e.category}`);
        if (sameCity) reasons.push("Near you");
        if (proximity > 0.7) reasons.push("Around the same time");
        if (popularity > 0.85) reasons.push("Trending");

        return { event: e, score, reason: reasons[0] ?? "Popular pick" };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [event]);

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-black mb-3">Event not found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find that event.</p>
          <Link to="/" className="text-primary font-bold underline">Back to all events</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCheckout = () => {
    toast.success("Tickets reserved!", {
      description: `${qty} × ${tier.name} • Total $${total.toFixed(2)}`,
    });
  };

  const handlePlay = (title: string) =>
    toast.info(`${title}`, { description: "Video player coming soon." });

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Navbar />

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground/80 hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back to events
          </Link>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-3xl">
            {event.badge && (
              <span className="badge-urgent px-3 py-1 rounded-full text-xs font-bold inline-block mb-4">
                {event.badge}
              </span>
            )}
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
              {event.category}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-foreground/80 font-medium">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" strokeWidth={2.5} /> {event.date}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" strokeWidth={2.5} /> {event.venue}</div>
              <div className="flex items-center gap-2"><Ticket className="w-4 h-4" strokeWidth={2.5} /> From {event.price}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky section nav */}
      <nav className="sticky top-16 z-30 border-y border-border bg-background/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex gap-1 overflow-x-auto no-scrollbar -mx-2 px-2">
            {sectionNav.map(({ id, label }) => {
              const active = activeSection === id;
              return (
                <li key={id} className="shrink-0">
                  <a
                    href={`#${id}`}
                    className={`relative inline-flex items-center px-3 py-3 text-sm font-bold transition-colors whitespace-nowrap ${
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                    {active && (
                      <motion.span
                        layoutId="section-underline"
                        className="absolute left-2 right-2 -bottom-px h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32 lg:pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: details + seat selection */}
          <div className="lg:col-span-2 space-y-16 scroll-smooth">
            <section id="overview" className="scroll-mt-32">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                <Info className="w-3.5 h-3.5" /> Overview
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-3">About this event</h2>
              <p className="text-muted-foreground leading-relaxed text-base">{event.description}</p>
            </section>

            {/* Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {eventStats.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <Icon className="w-4 h-4 text-primary mb-2" strokeWidth={2.5} />
                  <div className="text-lg font-black text-foreground leading-none">{value}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Featured Video Player Placeholder */}
            <section id="media" className="scroll-mt-32">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                    <Film className="w-3.5 h-3.5" /> Watch &amp; Listen
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">Get a feel for the show</h2>
                </div>
                <button
                  onClick={() => handlePlay("Share")}
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-foreground/70 hover:text-foreground"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>

              <motion.button
                onClick={() => handlePlay("Official Trailer")}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                className="group relative w-full aspect-video rounded-3xl overflow-hidden border border-border shadow-xl"
                aria-label="Play official trailer"
              >
                <img
                  src={event.image}
                  alt={`${event.title} trailer`}
                  className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-foreground/10" />
                {/* Animated rings around play button */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="absolute w-24 h-24 rounded-full bg-primary/30 animate-ping" />
                  <span className="relative w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl">
                    <Play className="w-8 h-8 ml-1" fill="currentColor" strokeWidth={0} />
                  </span>
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-left text-background">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider mb-2">
                    Official Trailer • 2:14
                  </span>
                  <div className="text-xl sm:text-2xl font-black tracking-tight">
                    {event.title}
                  </div>
                  <div className="text-sm text-background/80 font-medium">
                    A first look at the production, the setlist, and the stage.
                  </div>
                </div>
              </motion.button>

              {/* Video Clip Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                {videoClips.map((clip, i) => (
                  <motion.button
                    key={clip.title}
                    onClick={() => handlePlay(clip.title)}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                    whileHover={{ y: -3 }}
                    className="group relative aspect-video rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-primary/20 via-card to-accent/20 text-left"
                    aria-label={`Play ${clip.title}`}
                  >
                    {/* abstract motion lines as a "video poster" placeholder */}
                    <div className="absolute inset-0 opacity-60">
                      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary/40 blur-3xl" />
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-accent/40 blur-3xl" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-full bg-background/90 text-foreground text-[10px] font-black uppercase tracking-wider">
                        {clip.tag}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-foreground/70 text-background text-[10px] font-bold">
                      {clip.duration}
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-12 h-12 rounded-full bg-background/90 text-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5" fill="currentColor" strokeWidth={0} />
                      </span>
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-background">
                      <div className="text-sm font-black tracking-tight leading-tight">
                        {clip.title}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Fan Reels — vertical video placeholders */}
            <section id="reels" className="scroll-mt-32">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> Fan Reels
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">From the crowd</h2>
                </div>
                <span className="text-xs font-bold text-muted-foreground">Auto-curated</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {fanReels.map((reel, i) => (
                  <motion.button
                    key={reel.handle}
                    onClick={() => handlePlay(`Reel by ${reel.handle}`)}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                    whileHover={{ y: -3 }}
                    className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-border text-left"
                    aria-label={`Play reel from ${reel.handle}`}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          i % 2 === 0
                            ? "linear-gradient(160deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)"
                            : "linear-gradient(160deg, hsl(var(--accent)) 0%, hsl(var(--foreground)) 100%)",
                      }}
                    />
                    <div className="absolute inset-0 bg-foreground/20" />
                    <div className="absolute inset-0 mix-blend-overlay opacity-40">
                      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-background/40 blur-2xl" />
                      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-foreground/40 blur-2xl" />
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-11 h-11 rounded-full bg-background/90 text-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 ml-0.5" fill="currentColor" strokeWidth={0} />
                      </span>
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-background">
                      <div className="text-xs font-black">{reel.handle}</div>
                      <div className="text-[11px] font-medium text-background/80 line-clamp-2">
                        {reel.caption}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Lineup / schedule */}
            <section id="lineup" className="scroll-mt-32">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                <Music2 className="w-3.5 h-3.5" /> Lineup &amp; schedule
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-4">Who's playing &amp; when</h2>
              <ol className="relative border-l-2 border-border ml-2 space-y-5">
                {lineup.map((act, i) => (
                  <motion.li
                    key={act.name}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="pl-5"
                  >
                    <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                    <div className="flex items-baseline justify-between gap-3 flex-wrap">
                      <div>
                        <div className="font-black text-foreground">{act.name}</div>
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {act.role}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {act.time} <span className="text-muted-foreground font-medium">· {act.duration}</span>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </section>

            <section id="seats" className="scroll-mt-32">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                <Ticket className="w-3.5 h-3.5" /> Pick your seats
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-4">Select your seats</h2>

              {/* Interactive seating chart */}
              <div className="mb-5">
                <SeatingMap
                  tiers={tiers.map((t) => ({
                    id: t.id,
                    name: t.name,
                    color: t.color,
                    price: t.price,
                  }))}
                  activeTierId={tierId}
                  onSelectTier={setTierId}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {tiers.map((t) => {
                  const active = t.id === tierId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTierId(t.id)}
                      className={`text-left rounded-2xl border-2 p-4 transition-all ${
                        active
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <span className="flex items-center gap-2 font-bold text-foreground">
                          <span
                            className="w-2.5 h-2.5 rounded-sm"
                            style={{ background: t.color }}
                          />
                          {t.name}
                        </span>
                        {active && (
                          <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground">
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{t.description}</p>
                      <div className="flex items-end justify-between">
                        <span className="text-xl font-black text-foreground">${t.price}</span>
                        <span className="text-xs font-bold text-muted-foreground">{t.remaining} left</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Venue */}
            <section id="venue" className="scroll-mt-32">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                <MapPin className="w-3.5 h-3.5" /> Venue
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-4">{event.venue}</h2>
              <div className="rounded-3xl overflow-hidden border border-border bg-card">
                <div className="relative aspect-[16/8] bg-muted overflow-hidden">
                  {/* Stylized map placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-accent/15" />
                  <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="map-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#map-grid)" />
                  </svg>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="relative flex w-12 h-12 items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                      <span className="relative w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl">
                        <MapPin className="w-5 h-5" strokeWidth={2.5} />
                      </span>
                    </span>
                    <span className="mt-2 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur border border-border text-xs font-bold text-foreground shadow">
                      {event.venue}
                    </span>
                  </div>
                  <button
                    onClick={() => toast.info("Opening directions…")}
                    className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground text-background text-sm font-bold shadow-lg hover:opacity-90"
                  >
                    <Navigation className="w-4 h-4" /> Directions
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border">
                  {venueAmenities.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="p-4">
                      <Icon className="w-4 h-4 text-primary mb-2" strokeWidth={2.5} />
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
                      <div className="text-sm font-bold text-foreground mt-0.5">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Know before you go */}
            <section id="know" className="scroll-mt-32">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                <Info className="w-3.5 h-3.5" /> Know before you go
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-4">The essentials</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {knowBeforeYouGo.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="rounded-2xl border border-border bg-card p-4 flex gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="font-bold text-foreground mb-0.5">{title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section id="reviews" className="scroll-mt-32">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-2">
                <Star className="w-3.5 h-3.5" /> Fan reviews
              </div>
              <div className="flex items-baseline justify-between mb-4 gap-3 flex-wrap">
                <h2 className="text-2xl font-black tracking-tight">What fans are saying</h2>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-accent" fill="currentColor" strokeWidth={0} />
                  <span className="font-black text-foreground">4.8</span>
                  <span className="text-sm text-muted-foreground">· 2,340 reviews</span>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {reviews.map((r) => (
                  <div key={r.name} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < r.rating ? "text-accent" : "text-muted"}`}
                          fill="currentColor"
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mb-3">"{r.body}"</p>
                    <div className="text-xs font-bold text-muted-foreground">{r.name}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-32">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                <HelpCircle className="w-3.5 h-3.5" /> FAQ
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-4">Frequently asked</h2>
              <div className="rounded-2xl border border-border bg-card px-5">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((f, i) => (
                    <AccordionItem key={f.q} value={`faq-${i}`} className="border-border last:border-b-0">
                      <AccordionTrigger className="text-left font-bold text-foreground">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            {/* Resources */}
            <section id="resources" className="scroll-mt-32">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                <Download className="w-3.5 h-3.5" /> Resources
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-4">Plan your night</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: MapPin, title: "Venue map (PDF)", meta: "1.2 MB" },
                  { icon: CreditCard, title: "Box-office policies", meta: "Read" },
                  { icon: Calendar, title: "Add to calendar", meta: ".ics" },
                ].map(({ icon: Icon, title, meta }) => (
                  <button
                    key={title}
                    onClick={() => toast.info(title)}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 hover:border-primary/40 hover:bg-primary/5 transition-colors text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="w-4 h-4" strokeWidth={2.5} />
                      </span>
                      <span className="font-bold text-foreground">{title}</span>
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">{meta}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right: checkout sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 rounded-2xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-primary mb-4">
                <Ticket className="w-4 h-4" strokeWidth={2.5} /> ORDER SUMMARY
              </div>

              <div className="mb-5">
                <div className="font-bold text-foreground">{tier.name}</div>
                <div className="text-sm text-muted-foreground">${tier.price.toFixed(2)} per ticket</div>
              </div>

              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-bold text-foreground">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-bold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(8, q + 1))}
                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm py-4 border-t border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service fees</span><span>${fees.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline py-4 border-t border-border mb-5">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-2xl font-black text-foreground">${total.toFixed(2)}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                Checkout
              </motion.button>

              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={2.5} />
                100% Verified Tickets · Secure checkout
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* You may also like */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1">
              Keep exploring
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              You may also like
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Ranked by category, location & date proximity, and popularity
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedEvents.map(({ event: e, reason }, i) => (
            <div key={e.id} className="relative">
              <div className="absolute z-10 top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur border border-border text-[10px] font-bold uppercase tracking-wider text-foreground shadow-sm">
                {reason}
              </div>
              <EventCard {...e} index={i} />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetail;