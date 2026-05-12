import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Check, MapPin, Minus, Plus, ShieldCheck, Ticket } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getEventById } from "@/data/events";
import { toast } from "sonner";

interface SeatTier {
  id: string;
  name: string;
  description: string;
  price: number;
  remaining: number;
}

const tiers: SeatTier[] = [
  { id: "ga", name: "General Admission", description: "Standing floor access", price: 89, remaining: 142 },
  { id: "lower", name: "Lower Bowl", description: "Sections 101–120 • Reserved seating", price: 165, remaining: 38 },
  { id: "upper", name: "Upper Deck", description: "Sections 301–320 • Best value", price: 65, remaining: 220 },
  { id: "vip", name: "VIP Package", description: "Premium seat + early entry + merch", price: 349, remaining: 12 },
];

const SERVICE_FEE_RATE = 0.18;

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const event = id ? getEventById(id) : undefined;
  const [tierId, setTierId] = useState<string>("lower");
  const [qty, setQty] = useState(2);

  const tier = useMemo(() => tiers.find((t) => t.id === tierId)!, [tierId]);
  const subtotal = tier.price * qty;
  const fees = subtotal * SERVICE_FEE_RATE;
  const total = subtotal + fees;

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

  return (
    <div className="min-h-screen bg-background">
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
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-foreground/80 font-medium">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" strokeWidth={2.5} /> {event.date}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" strokeWidth={2.5} /> {event.venue}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: details + seat selection */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-black tracking-tight mb-3">About this event</h2>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight mb-4">Select your seats</h2>
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
                        <span className="font-bold text-foreground">{t.name}</span>
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
            </div>
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

      <Footer />
    </div>
  );
};

export default EventDetail;