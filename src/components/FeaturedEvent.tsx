import { motion } from "framer-motion";
import { Calendar, MapPin, Flame, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { EventItem } from "@/data/events";

const FeaturedEvent = ({ event }: { event: EventItem }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative group rounded-3xl overflow-hidden bg-card shadow-xl"
    >
      <Link to={`/events/${event.id}`} className="block">
        <div className="grid md:grid-cols-5 min-h-[420px]">
          {/* Image side */}
          <div className="md:col-span-3 relative aspect-[16/10] md:aspect-auto overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-foreground/80 via-foreground/30 to-transparent" />
            <div className="absolute top-5 left-5 flex gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-black tracking-wide uppercase">
                <Flame className="w-3.5 h-3.5" strokeWidth={3} />
                Featured
              </span>
              {event.badge && (
                <span className="px-3 py-1.5 rounded-full bg-background/90 backdrop-blur text-foreground text-xs font-bold">
                  {event.badge}
                </span>
              )}
            </div>
          </div>

          {/* Content side */}
          <div className="md:col-span-2 p-7 md:p-10 flex flex-col justify-between bg-gradient-to-br from-card to-secondary">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {event.category}
              </span>
              <h3 className="mt-3 text-3xl md:text-4xl font-black tracking-tight text-foreground leading-[1.1]">
                {event.title}
              </h3>
              <p className="mt-4 text-muted-foreground font-medium leading-relaxed line-clamp-3">
                {event.description}
              </p>

              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                  <Calendar className="w-4 h-4 text-primary" strokeWidth={2.5} />
                  {event.date}
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                  <MapPin className="w-4 h-4 text-primary" strokeWidth={2.5} />
                  {event.venue}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground font-medium">Starting from</div>
                <div className="text-2xl font-black text-foreground">{event.price}</div>
              </div>
              <span className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-bold rounded-2xl text-sm group-hover:gap-3 transition-all">
                Get Tickets
                <ArrowUpRight className="w-4 h-4" strokeWidth={3} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default FeaturedEvent;