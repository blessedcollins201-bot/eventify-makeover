import { motion } from "framer-motion";
import { Calendar, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import type { EventItem } from "@/data/events";

const EventRail = ({ events }: { events: EventItem[] }) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-5 h-5 text-accent" strokeWidth={2.5} />
        <h3 className="text-xl font-black tracking-tight text-foreground">
          Trending This Week
        </h3>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="shrink-0 w-[260px] snap-start"
          >
            <Link
              to={`/events/${event.id}`}
              className="group block rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center justify-center w-9 h-9 rounded-full bg-background/90 backdrop-blur text-foreground text-sm font-black">
                  {i + 1}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-primary-foreground/80 mb-1">
                    {event.category}
                  </div>
                  <h4 className="text-base font-bold leading-tight text-primary-foreground line-clamp-2">
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-2 text-primary-foreground/90 text-xs font-medium">
                    <Calendar className="w-3 h-3" strokeWidth={2.5} />
                    {event.date.split("•")[0].trim()}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EventRail;