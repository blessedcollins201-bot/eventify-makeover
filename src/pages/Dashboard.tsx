import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Ticket,
  Heart,
  Bell,
  Settings,
  CreditCard,
  Gift,
  LogOut,
  Calendar,
  MapPin,
  Download,
  QrCode,
  Sparkles,
  ChevronRight,
  Star,
  Music,
  Trophy,
  Mic,
  LayoutDashboard,
  Search,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  Plus,
} from "lucide-react";
import { clearUser, getUser, MockUser } from "@/lib/auth";
import { events } from "@/data/events";

type TabId = "overview" | "tickets" | "saved" | "rewards" | "settings";

const TABS: { id: TabId; label: string; icon: typeof Ticket }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tickets", label: "My Tickets", icon: Ticket },
  { id: "saved", label: "Saved Events", icon: Heart },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "settings", label: "Settings", icon: Settings },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();
  const [user, setUser] = useState<MockUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const active: TabId = (TABS.find((t) => t.id === tab)?.id ?? "overview") as TabId;

  useEffect(() => {
    const u = getUser();
    if (!u) {
      navigate("/login");
      return;
    }
    setUser(u);
  }, [navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [active]);

  const upcoming = useMemo(() => events.slice(0, 3), []);
  const saved = useMemo(() => events.slice(2, 5), []);

  if (!user) return null;

  const currentLabel = TABS.find((t) => t.id === active)?.label ?? "Overview";
  const signOut = () => {
    clearUser();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 border-r border-border bg-card flex flex-col transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Ticket className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-black text-foreground tracking-tight">TicketHub</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Menu</p>
          {TABS.map((t) => {
            const isActive = active === t.id;
            return (
              <Link
                key={t.id}
                to={t.id === "overview" ? "/dashboard" : `/dashboard/${t.id}`}
                className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <t.icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                <span className="flex-1">{t.label}</span>
                {t.id === "tickets" && (
                  <span className="px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold">3</span>
                )}
              </Link>
            );
          })}

          <p className="px-3 pt-5 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Support</p>
          <Link
            to="/help"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Help center
          </Link>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse events
          </Link>
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-black text-primary-foreground shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">Gold member</p>
            </div>
            <button
              onClick={signOut}
              className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 bg-background/80 backdrop-blur border-b border-border flex items-center gap-3 px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-md hover:bg-muted flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Dashboard</p>
            <h1 className="text-base sm:text-lg font-black text-foreground leading-tight">{currentLabel}</h1>
          </div>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-2 h-10 px-3 rounded-lg border border-border bg-muted/50 w-72">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Search events, orders, venues…"
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            <kbd className="text-[10px] font-bold text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</kbd>
          </div>
          <button className="relative w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center" aria-label="Notifications">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-black text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {active === "overview" && <Overview user={user} upcoming={upcoming} />}
          {active === "tickets" && <Tickets upcoming={upcoming} />}
          {active === "saved" && <Saved saved={saved} />}
          {active === "rewards" && <Rewards />}
          {active === "settings" && <SettingsTab user={user} onSignOut={signOut} />}
        </main>
      </div>
    </div>
  );
};

/* ---------- Sub-sections ---------- */

const STATS = [
  { label: "Upcoming tickets", value: "12", delta: "+2", trend: "up" as const, icon: Ticket, accent: "text-primary", bg: "bg-primary/10" },
  { label: "Saved events", value: "28", delta: "+5", trend: "up" as const, icon: Heart, accent: "text-accent", bg: "bg-accent/10" },
  { label: "Reward points", value: "2,480", delta: "+240", trend: "up" as const, icon: Gift, accent: "text-primary", bg: "bg-primary/10" },
  { label: "Spend this year", value: "$1,840", delta: "-12%", trend: "down" as const, icon: CreditCard, accent: "text-foreground", bg: "bg-muted" },
];

const Overview = ({ user, upcoming }: { user: MockUser; upcoming: typeof events }) => (
  <>
    {/* Greeting */}
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Welcome back, {user.name.split(" ")[0]}.
        </h2>
        <p className="text-sm text-muted-foreground font-medium mt-1">
          Here's what's happening with your account today.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-foreground text-background text-sm font-bold hover:opacity-90"
      >
        <Plus className="w-4 h-4" /> Find events
      </Link>
    </div>

    {/* Stat cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.accent} flex items-center justify-center`}>
              <s.icon className="w-4 h-4" />
            </div>
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                s.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
              }`}
            >
              {s.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {s.delta}
            </span>
          </div>
          <p className="text-2xl font-black text-foreground mt-4">{s.value}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
        </motion.div>
      ))}
    </div>

    {/* Main grid */}
    <div className="grid lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      <SectionCard title="Next up" cta={{ to: "/dashboard/tickets", label: "All tickets" }}>
        <div className="space-y-3">
          {upcoming.map((e) => (
            <TicketRow key={e.id} event={e} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Recommended for you" cta={{ to: "/", label: "Browse" }}>
        <div className="grid sm:grid-cols-3 gap-4">
          {events.slice(3, 6).map((e) => (
            <Link
              to={`/events/${e.id}`}
              key={e.id}
              className="group rounded-2xl overflow-hidden border border-border bg-background hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={e.image} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-3">
                <p className="text-xs text-primary font-bold uppercase tracking-wider">{e.category}</p>
                <p className="text-sm font-bold text-foreground line-clamp-1 mt-1">{e.title}</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{e.date.split("•")[0]}</p>
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>

    <div className="space-y-6">
      <SectionCard title="Recent activity">
        <ul className="space-y-3">
          {[
            { icon: Ticket, color: "text-primary", text: "Ordered 2× The Weeknd tickets", time: "2h ago" },
            { icon: Heart, color: "text-accent", text: "Saved NBA Playoffs to wishlist", time: "Yesterday" },
            { icon: Gift, color: "text-primary", text: "Earned 240 reward points", time: "3 days ago" },
            { icon: Bell, color: "text-accent", text: "Presale alert: Foo Fighters", time: "5 days ago" },
          ].map((a, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0 ${a.color}`}>
                <a.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{a.text}</p>
                <p className="text-xs text-muted-foreground font-medium">{a.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Reward tier">
        <div className="rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 text-background p-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/30 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-primary" fill="currentColor" />
              <span className="text-xs font-bold uppercase tracking-wider">Gold tier</span>
            </div>
            <p className="text-3xl font-black">2,480 pts</p>
            <p className="text-xs text-background/60 font-medium mt-1">520 pts until Platinum</p>
            <div className="mt-4 h-2 rounded-full bg-background/10 overflow-hidden">
              <div className="h-full w-[82%] bg-gradient-to-r from-primary to-accent rounded-full" />
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
    </div>
  </>
);

const Tickets = ({ upcoming }: { upcoming: typeof events }) => (
  <div className="space-y-4">
    {upcoming.map((e, i) => (
      <motion.div
        key={e.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
        className="rounded-3xl border border-border bg-card overflow-hidden flex flex-col md:flex-row"
      >
        <div className="md:w-56 h-40 md:h-auto shrink-0 relative">
          <img src={e.image} alt={e.title} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-background/90 text-foreground text-[10px] font-black uppercase tracking-wider">
            Confirmed
          </div>
        </div>
        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-primary uppercase tracking-wider">{e.category}</p>
            <h3 className="text-lg font-black text-foreground mt-1">{e.title}</h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground font-medium">
              <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{e.date}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{e.venue}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-2 py-0.5 rounded-md bg-muted text-foreground text-[11px] font-bold">Section 112</span>
              <span className="px-2 py-0.5 rounded-md bg-muted text-foreground text-[11px] font-bold">Row F</span>
              <span className="px-2 py-0.5 rounded-md bg-muted text-foreground text-[11px] font-bold">Seats 14-15</span>
            </div>
          </div>
          <div className="flex md:flex-col gap-2 md:w-40">
            <button className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity">
              <QrCode className="w-4 h-4" /> View ticket
            </button>
            <button className="flex-1 h-10 rounded-xl border border-border bg-background text-foreground text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-muted transition-colors">
              <Download className="w-4 h-4" /> PDF
            </button>
          </div>
        </div>
      </motion.div>
    ))}

    <div className="rounded-3xl border border-dashed border-border p-8 text-center">
      <p className="text-sm text-muted-foreground font-medium">That's everything coming up.</p>
      <Link to="/" className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold hover:opacity-90">
        Find more events
      </Link>
    </div>
  </div>
);

const Saved = ({ saved }: { saved: typeof events }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {saved.map((e) => (
      <Link
        to={`/events/${e.id}`}
        key={e.id}
        className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg transition-all"
      >
        <div className="aspect-[16/10] overflow-hidden relative">
          <img src={e.image} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 flex items-center justify-center text-accent">
            <Heart className="w-4 h-4" fill="currentColor" />
          </div>
        </div>
        <div className="p-4">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{e.category}</p>
          <h3 className="text-base font-black text-foreground mt-1 line-clamp-2">{e.title}</h3>
          <p className="text-xs text-muted-foreground font-medium mt-1">{e.venue}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground font-medium">From {e.price}</span>
            <span className="text-xs font-bold text-primary inline-flex items-center gap-0.5">
              View <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    ))}
  </div>
);

const Rewards = () => (
  <div className="grid lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-foreground via-foreground to-primary text-background p-8 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/30 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-primary-foreground" fill="currentColor" />
          <span className="text-xs font-bold uppercase tracking-wider">Gold member</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black">2,480 pts</h2>
        <p className="text-background/70 font-medium mt-2">520 points until Platinum tier — unlock VIP lounges & priority support.</p>
        <div className="mt-6 h-2 rounded-full bg-background/10 overflow-hidden">
          <div className="h-full w-[82%] bg-gradient-to-r from-primary-foreground to-accent rounded-full" />
        </div>
        <div className="grid grid-cols-3 mt-8 gap-4">
          {[
            { label: "Silver", points: "0" },
            { label: "Gold", points: "2k", current: true },
            { label: "Platinum", points: "3k" },
          ].map((t) => (
            <div
              key={t.label}
              className={`rounded-2xl p-3 text-center border ${
                t.current ? "bg-background/15 border-background/30" : "border-background/10"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider opacity-70">{t.label}</p>
              <p className="text-lg font-black mt-1">{t.points}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <SectionCard title="Redeem">
      <ul className="space-y-3">
        {[
          { title: "$25 off any order", cost: "500 pts", icon: CreditCard },
          { title: "Free presale upgrade", cost: "750 pts", icon: Sparkles },
          { title: "VIP lounge access", cost: "1,500 pts", icon: Star },
        ].map((r) => (
          <li
            key={r.title}
            className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <r.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{r.title}</p>
                <p className="text-xs text-muted-foreground font-medium">{r.cost}</p>
              </div>
            </div>
            <button className="text-xs font-bold text-primary hover:underline">Redeem</button>
          </li>
        ))}
      </ul>
    </SectionCard>

    <SectionCard title="Ways to earn" className="lg:col-span-3">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: Music, title: "Buy concert tickets", body: "10 pts per $1 spent on live music." },
          { icon: Trophy, title: "Attend sports events", body: "12 pts per $1 + bonus for playoffs." },
          { icon: Mic, title: "Refer a friend", body: "500 pts when a friend joins & buys." },
        ].map((w) => (
          <div key={w.title} className="rounded-2xl border border-border bg-card p-5">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-3">
              <w.icon className="w-4 h-4" />
            </div>
            <p className="font-bold text-foreground">{w.title}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">{w.body}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  </div>
);

const SettingsTab = ({ user, onSignOut }: { user: MockUser; onSignOut: () => void }) => (
  <div className="grid lg:grid-cols-3 gap-6">
    <SectionCard title="Profile" className="lg:col-span-2">
      <form className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name" defaultValue={user.name} />
        <Field label="Email" type="email" defaultValue={user.email} />
        <Field label="Phone" type="tel" placeholder="+1 (555) 555-5555" />
        <Field label="City" placeholder="New York" />
        <div className="sm:col-span-2 flex justify-end gap-2">
          <button type="button" className="h-10 px-4 rounded-xl border border-border bg-background text-foreground text-sm font-bold hover:bg-muted">
            Cancel
          </button>
          <button type="button" className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90">
            Save changes
          </button>
        </div>
      </form>
    </SectionCard>

    <SectionCard title="Notifications">
      <ul className="space-y-3">
        {[
          { label: "Presale alerts", on: true },
          { label: "Price drops", on: true },
          { label: "New events in my city", on: false },
          { label: "Order updates", on: true },
          { label: "Marketing emails", on: false },
        ].map((n) => (
          <li key={n.label} className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{n.label}</span>
            <Toggle defaultOn={n.on} />
          </li>
        ))}
      </ul>
    </SectionCard>

    <SectionCard title="Payment methods" className="lg:col-span-2">
      <ul className="space-y-3">
        {[
          { brand: "Visa", last4: "4242", exp: "08/28", default: true },
          { brand: "Mastercard", last4: "8821", exp: "11/27" },
        ].map((p) => (
          <li key={p.last4} className="flex items-center justify-between p-3 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 rounded-md bg-foreground text-background text-[10px] font-black flex items-center justify-center">
                {p.brand.slice(0, 4).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">•••• {p.last4}</p>
                <p className="text-xs text-muted-foreground font-medium">Expires {p.exp}</p>
              </div>
            </div>
            {p.default ? (
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                Default
              </span>
            ) : (
              <button className="text-xs font-bold text-primary hover:underline">Set default</button>
            )}
          </li>
        ))}
        <li>
          <button className="w-full h-11 rounded-2xl border-2 border-dashed border-border text-sm font-bold text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
            + Add payment method
          </button>
        </li>
      </ul>
    </SectionCard>

    <SectionCard title="Account" className="lg:col-span-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex-1 h-11 rounded-xl border border-border bg-background text-sm font-bold text-foreground hover:bg-muted">
          Change password
        </button>
        <button className="flex-1 h-11 rounded-xl border border-border bg-background text-sm font-bold text-foreground hover:bg-muted">
          Download my data
        </button>
        <button
          onClick={onSignOut}
          className="flex-1 h-11 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold hover:opacity-90 flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </SectionCard>
  </div>
);

/* ---------- Small primitives ---------- */

const SectionCard = ({
  title,
  cta,
  children,
  className = "",
}: {
  title: string;
  cta?: { to: string; label: string };
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`rounded-3xl border border-border bg-card p-5 sm:p-6 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-black tracking-tight text-foreground">{title}</h2>
      {cta && (
        <Link to={cta.to} className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-0.5">
          {cta.label} <ChevronRight className="w-3 h-3" />
        </Link>
      )}
    </div>
    {children}
  </div>
);

const TicketRow = ({ event }: { event: (typeof events)[number] }) => (
  <Link
    to={`/events/${event.id}`}
    className="flex items-center gap-4 p-3 rounded-2xl border border-border bg-background hover:bg-muted transition-colors"
  >
    <img src={event.image} alt={event.title} className="w-16 h-16 rounded-xl object-cover" />
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{event.category}</p>
      <p className="text-sm font-bold text-foreground truncate">{event.title}</p>
      <p className="text-xs text-muted-foreground font-medium truncate">
        {event.date} · {event.venue}
      </p>
    </div>
    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
  </Link>
);

const Field = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="block">
    <span className="text-xs font-bold text-foreground uppercase tracking-wider mb-1.5 block">{label}</span>
    <input
      {...props}
      className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
    />
  </label>
);

const Toggle = ({ defaultOn = false }: { defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((o) => !o)}
      className={`relative w-10 h-6 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-background shadow-sm transition-transform ${
          on ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
};

export default Dashboard;