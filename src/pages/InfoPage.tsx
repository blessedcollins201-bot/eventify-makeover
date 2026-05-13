import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTION_LABELS: Record<string, { label: string; tagline: string }> = {
  discover: { label: "Discover", tagline: "Browse what's happening, by the genre you love." },
  help: { label: "Help Center", tagline: "Answers, support, and human help when you need it." },
  company: { label: "Company", tagline: "Who we are and where we're going." },
  legal: { label: "Legal", tagline: "The fine print, kept clear." },
  fans: { label: "For Fans", tagline: "Perks, drops, and tools built for the front row." },
};

const titleize = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const InfoPage = () => {
  const { section = "", slug = "" } = useParams<{ section: string; slug?: string }>();
  const meta = SECTION_LABELS[section] ?? { label: titleize(section), tagline: "" };
  const pageTitle = slug ? titleize(slug) : meta.label;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="relative flex-1">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-32 w-[480px] h-[480px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-40 -right-32 w-[420px] h-[420px] rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground/70 hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3 h-3" /> {meta.label}
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.05] mb-5">
              {pageTitle}
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
              {meta.tagline ||
                "We're putting the finishing touches on this page. Check back soon — or keep exploring live events in the meantime."}
            </p>

            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {["Curated picks", "Trusted resale", "Mobile tickets"].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                    Feature {i + 1}
                  </div>
                  <div className="font-bold text-foreground">{feature}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-3">
              <Link
                to="/"
                className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Browse events
              </Link>
              <Link
                to="/help/customer-service"
                className="px-6 py-3 bg-card border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors"
              >
                Contact support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InfoPage;