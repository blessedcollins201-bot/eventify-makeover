import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Music,
  Trophy,
  Drama,
  Users,
  Star,
  Calendar,
  Mic,
  LifeBuoy,
  UserCog,
  Receipt,
  HelpCircle,
  Accessibility,
  Gift,
  Building2,
  Briefcase,
  Newspaper,
  Handshake,
  LineChart,
  Leaf,
  FileText,
  ShieldCheck,
  Cookie,
  Megaphone,
  Ban,
  Scale,
  Smartphone,
  BadgePercent,
  Zap,
  UmbrellaIcon,
  UsersRound,
  RefreshCw,
  ChevronRight,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { events } from "@/data/events";
import EventCard from "@/components/EventCard";

type Icon = typeof Music;

interface PageContent {
  eyebrow: string;
  title: string;
  tagline: string;
  highlights?: { icon: Icon; title: string; body: string }[];
  faqs?: { q: string; a: string }[];
  showEvents?: boolean;
  category?: string;
  type?: "legal" | "default";
  body?: string[];
}

const SECTION_META: Record<string, { label: string; tagline: string; eyebrow: string }> = {
  discover: { label: "Discover", tagline: "Browse what's happening, by the genre you love.", eyebrow: "Discover" },
  help: { label: "Help Center", tagline: "Answers, support, and human help when you need it.", eyebrow: "Support" },
  company: { label: "Company", tagline: "Who we are and where we're going.", eyebrow: "About us" },
  legal: { label: "Legal", tagline: "The fine print, kept clear.", eyebrow: "Legal" },
  fans: { label: "For Fans", tagline: "Perks, drops, and tools built for the front row.", eyebrow: "For fans" },
};

const CONTENT: Record<string, Partial<PageContent>> = {
  // ---------- Discover ----------
  "discover/concerts": {
    eyebrow: "Live music",
    title: "Concerts",
    tagline: "Stadium-fillers, club nights, and everything in between. Find your next live music moment.",
    highlights: [
      { icon: Music, title: "Every genre", body: "Pop, rock, EDM, hip-hop, country, classical — it's all here." },
      { icon: Star, title: "Presale access", body: "Members get tickets 48h before the public on-sale." },
      { icon: Zap, title: "Drop alerts", body: "Be the first to know when your favorite artist announces a tour." },
    ],
    showEvents: true,
    category: "Concerts",
  },
  "discover/sports": {
    eyebrow: "Live sports",
    title: "Sports",
    tagline: "From regular season to championship runs. Get courtside, fieldside, or rinkside.",
    highlights: [
      { icon: Trophy, title: "All leagues", body: "NBA, NFL, NHL, MLB, MLS, college, and international." },
      { icon: Star, title: "Season tickets", body: "Lock in your seats for the whole season with flexible plans." },
      { icon: Calendar, title: "Playoff priority", body: "Season-ticket holders get first dibs on postseason." },
    ],
    showEvents: true,
    category: "Sports",
  },
  "discover/arts-and-theater": {
    eyebrow: "Performing arts",
    title: "Arts & Theater",
    tagline: "Broadway hits, ballets, orchestras, and the most talked-about productions of the season.",
    highlights: [
      { icon: Drama, title: "Broadway & beyond", body: "From Times Square premieres to West End transfers." },
      { icon: Star, title: "Best seats", body: "Real-time seat maps so you know exactly what you're getting." },
      { icon: Calendar, title: "Long-run shows", body: "Plan months ahead with confidence." },
    ],
    showEvents: true,
    category: "Theater",
  },
  "discover/family": {
    eyebrow: "Family-friendly",
    title: "Family",
    tagline: "Ice shows, kids' tours, magic shows, and unforgettable days out everyone will remember.",
    highlights: [
      { icon: Users, title: "All ages", body: "Curated picks for toddlers, kids, tweens, and teens." },
      { icon: BadgePercent, title: "Family bundles", body: "Save when you book four or more seats together." },
      { icon: Accessibility, title: "Sensory-friendly", body: "Filter for low-stimulation performances." },
    ],
    showEvents: true,
  },
  "discover/vip-experiences": {
    eyebrow: "Premium",
    title: "VIP Experiences",
    tagline: "Backstage tours, soundchecks, premium hospitality, and once-in-a-lifetime meet & greets.",
    highlights: [
      { icon: Star, title: "Premium hospitality", body: "Open bars, curated menus, dedicated entrances." },
      { icon: Mic, title: "Soundcheck access", body: "Watch your favorite artist warm up — just for VIPs." },
      { icon: Sparkles, title: "Exclusive merch", body: "Limited-edition gifts only available to VIP guests." },
    ],
    showEvents: true,
  },
  "discover/festivals": {
    eyebrow: "Multi-day",
    title: "Festivals",
    tagline: "Camping passes, weekend wristbands, and the lineup announcements you've been waiting for.",
    highlights: [
      { icon: Calendar, title: "Multi-day passes", body: "GA, VIP, and camping options for every budget." },
      { icon: Zap, title: "Payment plans", body: "Split your wristband over interest-free installments." },
      { icon: UmbrellaIcon, title: "Weather guarantee", body: "Refund protection if the show can't go on." },
    ],
    showEvents: true,
    category: "Festivals",
  },
  "discover/comedy": {
    eyebrow: "Stand-up",
    title: "Comedy",
    tagline: "Arena tours, intimate clubs, comedy festivals, and the comics blowing up your feed.",
    highlights: [
      { icon: Mic, title: "Big names & rising stars", body: "From headliners to the next big thing." },
      { icon: Star, title: "Premium seating", body: "Get up close — heckling not encouraged." },
      { icon: Calendar, title: "Same-week shows", body: "Late drops for spontaneous nights out." },
    ],
    showEvents: true,
    category: "Comedy",
  },

  // ---------- Help ----------
  "help/customer-service": {
    eyebrow: "Support",
    title: "Customer Service",
    tagline: "Real people, fast answers. We're here 24/7 — chat, email, or call.",
    highlights: [
      { icon: MessageCircle, title: "Live chat", body: "Average wait under 60 seconds, day or night." },
      { icon: Mail, title: "Email support", body: "Response within 4 business hours, guaranteed." },
      { icon: Phone, title: "Phone line", body: "Talk to a human at 1-800-TICKETS — every day." },
    ],
    faqs: [
      { q: "How do I contact support?", a: "Use the live chat in the bottom-right of any page, email support@ticketmaster.com, or call 1-800-TICKETS." },
      { q: "What are your hours?", a: "Our support team is online 24 hours a day, 7 days a week — including holidays." },
    ],
  },
  "help/my-account": {
    eyebrow: "Support",
    title: "My Account",
    tagline: "Update your profile, manage notifications, and keep your account secure.",
    highlights: [
      { icon: UserCog, title: "Profile settings", body: "Name, email, phone, payment methods, address book." },
      { icon: ShieldCheck, title: "Security", body: "Enable 2FA, manage active sessions, change your password." },
      { icon: Megaphone, title: "Notifications", body: "Pick exactly which alerts you want — and which you don't." },
    ],
    faqs: [
      { q: "How do I reset my password?", a: "Go to Sign in and click 'Forgot?' — we'll email you a reset link instantly." },
      { q: "Can I delete my account?", a: "Yes. Visit Settings → Account → Delete account. Your data is permanently removed within 30 days." },
    ],
  },
  "help/order-history": {
    eyebrow: "Support",
    title: "Order History",
    tagline: "Every ticket you've ever ordered, organized and downloadable.",
    highlights: [
      { icon: Receipt, title: "All your receipts", body: "Download itemized PDFs for any past order." },
      { icon: Calendar, title: "Upcoming & past", body: "Filter by date, event, or status in seconds." },
      { icon: RefreshCw, title: "Re-send tickets", body: "Forwarded to a friend? Pull a fresh copy anytime." },
    ],
  },
  "help/faqs": {
    eyebrow: "Support",
    title: "Frequently Asked Questions",
    tagline: "The questions we get every day — answered in plain English.",
    faqs: [
      { q: "Are my tickets real?", a: "Yes. Every ticket sold on Ticketmaster is 100% verified and backed by our buyer guarantee." },
      { q: "Can I get a refund?", a: "Refunds are issued automatically if an event is canceled. For postponements, you can choose a refund or keep your tickets for the new date." },
      { q: "When will I receive my tickets?", a: "Mobile tickets are typically delivered within 72 hours of the event. You'll get an email and push notification the moment they're ready." },
      { q: "Can I transfer my tickets?", a: "Yes. Open the order in your dashboard, tap 'Transfer', and enter your friend's email. They'll get the tickets instantly." },
      { q: "What if the event is canceled?", a: "You'll be refunded in full to your original payment method within 7-10 business days. No action required." },
      { q: "Can I resell my tickets?", a: "Most tickets can be resold on our marketplace. Visit your dashboard → tap the order → 'Sell'." },
    ],
  },
  "help/accessibility": {
    eyebrow: "Support",
    title: "Accessibility",
    tagline: "Every fan deserves a great seat. Here's how we make sure of it.",
    highlights: [
      { icon: Accessibility, title: "ADA seating", body: "Filter for wheelchair-accessible and companion seats on every event." },
      { icon: Users, title: "Service animals", body: "Always welcome at every venue we serve." },
      { icon: LifeBuoy, title: "Dedicated support", body: "Call our accessibility team at 1-800-FOR-FANS for personalized help." },
    ],
  },
  "help/gift-cards": {
    eyebrow: "Support",
    title: "Gift Cards",
    tagline: "The perfect gift for the fan who's seen everything — except their next favorite show.",
    highlights: [
      { icon: Gift, title: "Any amount", body: "From $25 to $1,000 — pick what feels right." },
      { icon: Zap, title: "Instant delivery", body: "Email it now, or schedule for the perfect moment." },
      { icon: Calendar, title: "Never expires", body: "Recipients have all the time in the world to redeem." },
    ],
  },

  // ---------- Company ----------
  "company/about-us": {
    eyebrow: "About us",
    title: "About Ticketmaster",
    tagline: "We're on a mission to connect fans with the moments that move them.",
    body: [
      "For over four decades, Ticketmaster has been the trusted bridge between fans and the artists, teams, and shows they love. Today we serve more than 230 million fans across 30+ countries, powering everything from intimate club nights to sold-out stadium tours.",
      "We believe live experiences are the heartbeat of culture. Every ticket we sell is a story — a first date, a milestone birthday, a once-in-a-lifetime moment. That's why we obsess over every detail: from the moment you discover an event to the second you tap your phone at the gate.",
    ],
    highlights: [
      { icon: Building2, title: "Headquarters", body: "Los Angeles, with offices in 30+ countries." },
      { icon: Users, title: "230M+ fans", body: "Trust us with their tickets every year." },
      { icon: Trophy, title: "40+ years", body: "Of putting fans in the front row." },
    ],
  },
  "company/careers": {
    eyebrow: "Careers",
    title: "Build the future of live",
    tagline: "Join a team of fans, engineers, and dreamers shaping how the world experiences live events.",
    highlights: [
      { icon: Briefcase, title: "200+ open roles", body: "Engineering, design, marketing, ops, and more." },
      { icon: Users, title: "Remote-friendly", body: "Hybrid and fully-remote roles across the globe." },
      { icon: Star, title: "Real perks", body: "Concert credits, flexible PTO, and parental leave we're proud of." },
    ],
  },
  "company/press": {
    eyebrow: "Press",
    title: "Press & Media",
    tagline: "Latest news, executive bios, brand assets, and media contacts in one place.",
    highlights: [
      { icon: Newspaper, title: "Newsroom", body: "Announcements, partnerships, and tour reveals." },
      { icon: FileText, title: "Brand assets", body: "Logos, photography, and approved marks for download." },
      { icon: Mail, title: "Media contact", body: "press@ticketmaster.com — we respond same-day." },
    ],
  },
  "company/partners": {
    eyebrow: "Partnerships",
    title: "Partners",
    tagline: "The venues, promoters, leagues, and brands powering live entertainment with us.",
    highlights: [
      { icon: Handshake, title: "12,000+ venues", body: "From local theaters to global arenas." },
      { icon: Trophy, title: "All major leagues", body: "Official ticketing partner of NBA, NFL, NHL, and MLB clubs." },
      { icon: Star, title: "Brand partners", body: "We power experiences for the world's most-loved brands." },
    ],
  },
  "company/investors": {
    eyebrow: "Investors",
    title: "Investor Relations",
    tagline: "Quarterly earnings, SEC filings, and resources for shareholders.",
    highlights: [
      { icon: LineChart, title: "Latest earnings", body: "Q4 2025 results — beat consensus on revenue and bookings." },
      { icon: FileText, title: "SEC filings", body: "10-K, 10-Q, 8-K, and proxy statements." },
      { icon: Mail, title: "IR contact", body: "investors@ticketmaster.com" },
    ],
  },
  "company/sustainability": {
    eyebrow: "Sustainability",
    title: "Sustainability",
    tagline: "Live events should leave fans uplifted — and the planet better than we found it.",
    highlights: [
      { icon: Leaf, title: "Net zero by 2030", body: "Across our owned operations and ticketing infrastructure." },
      { icon: Smartphone, title: "Paperless first", body: "98% of tickets delivered digitally in 2025." },
      { icon: Handshake, title: "Tour Green", body: "Partnering with artists to offset every show on the road." },
    ],
  },

  // ---------- Legal ----------
  "legal/terms-of-use": {
    eyebrow: "Legal",
    title: "Terms of Use",
    tagline: "Last updated May 2026.",
    type: "legal",
    body: [
      "These Terms of Use govern your access to and use of Ticketmaster's websites, mobile apps, and services. By accessing or using our services, you agree to be bound by these terms.",
      "All tickets sold are subject to the policies of the venue, promoter, and event organizer. Resale of tickets may be restricted by local laws and event-specific rules.",
      "We reserve the right to refuse service, cancel orders, or terminate accounts that violate these terms or that we suspect of fraudulent activity.",
      "These terms are governed by the laws of the State of California, without regard to its conflict of laws principles.",
    ],
  },
  "legal/privacy-policy": {
    eyebrow: "Legal",
    title: "Privacy Policy",
    tagline: "How we collect, use, and protect your information.",
    type: "legal",
    body: [
      "We collect information you provide when creating an account, purchasing tickets, or contacting support. This includes your name, email, phone number, payment details, and event preferences.",
      "We use this information to process orders, deliver tickets, send relevant alerts, prevent fraud, and improve our services. We never sell your personal information to third parties.",
      "You can access, update, or delete your personal data at any time from your account settings. You can also opt out of marketing communications with one click.",
      "We retain your data for as long as your account is active or as required by law. After account deletion, your data is permanently removed within 30 days.",
    ],
  },
  "legal/cookie-settings": {
    eyebrow: "Legal",
    title: "Cookie Settings",
    tagline: "Control how we use cookies and similar technologies.",
    highlights: [
      { icon: Cookie, title: "Essential cookies", body: "Required for sign-in, checkout, and security. Always on." },
      { icon: LineChart, title: "Analytics", body: "Help us understand how fans use the site. Toggle anytime." },
      { icon: Megaphone, title: "Marketing", body: "Personalize ads and recommendations. Off by default." },
    ],
  },
  "legal/ad-choices": {
    eyebrow: "Legal",
    title: "Ad Choices",
    tagline: "How we personalize the ads you see — and how to opt out.",
    type: "legal",
    body: [
      "We work with advertising partners to show you ads that are relevant to your interests, including events you might love based on your browsing and purchase history.",
      "You can opt out of personalized advertising at any time by adjusting your cookie preferences or by visiting the Digital Advertising Alliance's opt-out page.",
    ],
  },
  "legal/do-not-sell": {
    eyebrow: "Legal",
    title: "Do Not Sell My Personal Information",
    tagline: "Your CCPA rights — exercised in one click.",
    highlights: [
      { icon: Ban, title: "We don't sell your data", body: "But you have the right to formally opt out anyway." },
      { icon: ShieldCheck, title: "Submit a request", body: "Use the form at the bottom of this page — we respond within 45 days." },
    ],
  },
  "legal/licenses": {
    eyebrow: "Legal",
    title: "Licenses",
    tagline: "Open-source software and third-party licenses powering our platform.",
    type: "legal",
    body: [
      "Our platform is built on the shoulders of incredible open-source software. We're grateful to the maintainers and contributors who make it possible.",
      "A complete list of third-party libraries and their respective licenses is available on request — email legal@ticketmaster.com.",
    ],
  },

  // ---------- For Fans ----------
  "fans/mobile-app": {
    eyebrow: "For fans",
    title: "Mobile App",
    tagline: "Tickets in your pocket. Tap in, tap out. Apple Pay & Google Pay supported.",
    highlights: [
      { icon: Smartphone, title: "Mobile-first", body: "Designed for the moment between Uber and gate." },
      { icon: Zap, title: "Instant alerts", body: "Presale drops, gate openings, and lineup changes — pushed straight to you." },
      { icon: ShieldCheck, title: "Secure delivery", body: "Encrypted barcodes that refresh every 60 seconds." },
    ],
  },
  "fans/fan-rewards": {
    eyebrow: "For fans",
    title: "Fan Rewards",
    tagline: "Earn points on every order. Redeem for discounts, upgrades, and VIP perks.",
    highlights: [
      { icon: Gift, title: "Earn on every order", body: "10 points per $1 spent. Faster on featured events." },
      { icon: Star, title: "Tier up", body: "Silver → Gold → Platinum. Better perks at every level." },
      { icon: Sparkles, title: "Members-only drops", body: "Access to exclusive shows and pre-public on-sales." },
    ],
  },
  "fans/presales": {
    eyebrow: "For fans",
    title: "Presales",
    tagline: "Get tickets before the general public — up to 48 hours early.",
    highlights: [
      { icon: Zap, title: "48h head start", body: "Members buy first on the biggest tours of the year." },
      { icon: Megaphone, title: "Presale alerts", body: "Personalized to the artists and teams you follow." },
      { icon: Star, title: "Verified Fan", body: "Skip the bots with our verification system." },
    ],
  },
  "fans/ticket-insurance": {
    eyebrow: "For fans",
    title: "Ticket Insurance",
    tagline: "Life happens. Get a full refund if you can't make the show.",
    highlights: [
      { icon: UmbrellaIcon, title: "Full refund", body: "100% back if illness, work, or weather gets in the way." },
      { icon: Zap, title: "Add at checkout", body: "Just $4-$12 per ticket, depending on event." },
      { icon: ShieldCheck, title: "No questions asked", body: "Simple online claim — most are processed in 48h." },
    ],
  },
  "fans/group-sales": {
    eyebrow: "For fans",
    title: "Group Sales",
    tagline: "Birthdays, corporate outings, school trips, or just a big squad — we've got you.",
    highlights: [
      { icon: UsersRound, title: "10+ tickets", body: "Group discounts kick in at 10 seats and scale from there." },
      { icon: BadgePercent, title: "Private rates", body: "Better pricing than public on-sale for most events." },
      { icon: Mail, title: "Dedicated agent", body: "One contact, one invoice, zero hassle. Email groups@ticketmaster.com." },
    ],
  },
  "fans/resale": {
    eyebrow: "For fans",
    title: "Resale",
    tagline: "Buy verified tickets from other fans. Or sell yours in a few taps.",
    highlights: [
      { icon: RefreshCw, title: "Verified Resale", body: "Every ticket re-verified before transfer — no fakes, ever." },
      { icon: BadgePercent, title: "Fair pricing", body: "We show you market-average prices so nobody overpays." },
      { icon: ShieldCheck, title: "Buyer guarantee", body: "Full refund if a resale ticket doesn't work — guaranteed." },
    ],
  },
};

const SECTION_OVERVIEW: Record<string, { icon: Icon; label: string; to: string }[]> = {
  discover: [
    { icon: Music, label: "Concerts", to: "/discover/concerts" },
    { icon: Trophy, label: "Sports", to: "/discover/sports" },
    { icon: Drama, label: "Arts & Theater", to: "/discover/arts-and-theater" },
    { icon: Users, label: "Family", to: "/discover/family" },
    { icon: Star, label: "VIP Experiences", to: "/discover/vip-experiences" },
    { icon: Calendar, label: "Festivals", to: "/discover/festivals" },
    { icon: Mic, label: "Comedy", to: "/discover/comedy" },
  ],
  help: [
    { icon: LifeBuoy, label: "Customer Service", to: "/help/customer-service" },
    { icon: UserCog, label: "My Account", to: "/help/my-account" },
    { icon: Receipt, label: "Order History", to: "/help/order-history" },
    { icon: HelpCircle, label: "FAQs", to: "/help/faqs" },
    { icon: Accessibility, label: "Accessibility", to: "/help/accessibility" },
    { icon: Gift, label: "Gift Cards", to: "/help/gift-cards" },
  ],
  company: [
    { icon: Building2, label: "About Us", to: "/company/about-us" },
    { icon: Briefcase, label: "Careers", to: "/company/careers" },
    { icon: Newspaper, label: "Press", to: "/company/press" },
    { icon: Handshake, label: "Partners", to: "/company/partners" },
    { icon: LineChart, label: "Investors", to: "/company/investors" },
    { icon: Leaf, label: "Sustainability", to: "/company/sustainability" },
  ],
  legal: [
    { icon: FileText, label: "Terms of Use", to: "/legal/terms-of-use" },
    { icon: ShieldCheck, label: "Privacy Policy", to: "/legal/privacy-policy" },
    { icon: Cookie, label: "Cookie Settings", to: "/legal/cookie-settings" },
    { icon: Megaphone, label: "Ad Choices", to: "/legal/ad-choices" },
    { icon: Ban, label: "Do Not Sell", to: "/legal/do-not-sell" },
    { icon: Scale, label: "Licenses", to: "/legal/licenses" },
  ],
  fans: [
    { icon: Smartphone, label: "Mobile App", to: "/fans/mobile-app" },
    { icon: Gift, label: "Fan Rewards", to: "/fans/fan-rewards" },
    { icon: Zap, label: "Presales", to: "/fans/presales" },
    { icon: UmbrellaIcon, label: "Ticket Insurance", to: "/fans/ticket-insurance" },
    { icon: UsersRound, label: "Group Sales", to: "/fans/group-sales" },
    { icon: RefreshCw, label: "Resale", to: "/fans/resale" },
  ],
};

const titleize = (slug: string) =>
  slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const InfoPage = () => {
  const { slug = "" } = useParams<{ slug?: string }>();
  const { pathname } = useLocation();
  const section = pathname.split("/").filter(Boolean)[0] ?? "";
  const sectionMeta = SECTION_META[section] ?? { label: titleize(section), tagline: "", eyebrow: section };
  const key = `${section}/${slug}`;
  const content = CONTENT[key];
  const isSectionLanding = !slug;

  const relatedEvents = content?.category
    ? events.filter((e) => e.category === content.category)
    : content?.showEvents
      ? events.slice(0, 3)
      : [];

  const overview = SECTION_OVERVIEW[section];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="relative flex-1">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-32 w-[480px] h-[480px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-40 -right-32 w-[420px] h-[420px] rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          <Link
            to={isSectionLanding ? "/" : `/${section}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground/70 hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            {isSectionLanding ? "Back to home" : `Back to ${sectionMeta.label}`}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3 h-3" /> {content?.eyebrow ?? sectionMeta.eyebrow}
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.05] mb-5">
              {content?.title ?? (slug ? titleize(slug) : sectionMeta.label)}
            </h1>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              {content?.tagline ?? sectionMeta.tagline}
            </p>
          </motion.div>

          {/* Section landing: grid of sublinks */}
          {isSectionLanding && overview && (
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {overview.map((o, i) => (
                <motion.div
                  key={o.to}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  <Link
                    to={o.to}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:border-primary hover:shadow-lg transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <o.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground">{o.label}</p>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">Browse {o.label.toLowerCase()}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Highlights */}
          {content?.highlights && (
            <div className="mt-12 grid sm:grid-cols-3 gap-4">
              {content.highlights.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.4 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <h.icon className="w-4 h-4" />
                  </div>
                  <p className="font-bold text-foreground mb-1">{h.title}</p>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{h.body}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Long-form body */}
          {content?.body && (
            <div
              className={`mt-12 max-w-3xl space-y-4 ${
                content.type === "legal" ? "rounded-2xl border border-border bg-card p-6 sm:p-8" : ""
              }`}
            >
              {content.body.map((p, i) => (
                <p key={i} className="text-base text-foreground/80 font-medium leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          )}

          {/* FAQs */}
          {content?.faqs && (
            <div className="mt-12 max-w-3xl">
              <h2 className="text-2xl font-black tracking-tight text-foreground mb-5">FAQs</h2>
              <div className="space-y-3">
                {content.faqs.map((f, i) => (
                  <details
                    key={i}
                    className="group rounded-2xl border border-border bg-card p-5 [&_summary]:cursor-pointer"
                  >
                    <summary className="flex items-center justify-between gap-4 font-bold text-foreground list-none">
                      <span>{f.q}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed mt-3">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Related events */}
          {relatedEvents.length > 0 && (
            <div className="mt-16">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">On sale now</p>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                    {content?.category ? `Featured ${content.category}` : "Featured events"}
                  </h2>
                </div>
                <Link to="/" className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-0.5">
                  See all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedEvents.slice(0, 3).map((e, i) => (
                  <EventCard key={e.id} {...e} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 rounded-3xl bg-foreground text-background p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Still have questions?</h3>
                <p className="text-background/60 font-medium mt-1">
                  Our support team is online 24/7. Or just keep exploring — there's always something happening.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="px-5 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity text-sm"
                >
                  Browse events
                </Link>
                <Link
                  to="/help/customer-service"
                  className="px-5 py-3 bg-background/10 border border-background/20 text-background font-bold rounded-xl hover:bg-background/20 transition-colors text-sm"
                >
                  Contact support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InfoPage;