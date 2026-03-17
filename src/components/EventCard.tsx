import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

interface EventCardProps {
  image: string;
  title: string;
  date: string;
  venue: string;
  price: string;
  badge?: string;
  index: number;
}

const EventCard = ({ image, title, date, venue, price, badge, index }: EventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="card-event rounded-2xl overflow-hidden bg-card cursor-pointer group"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        {badge && (
          <span className="absolute top-3 left-3 badge-urgent px-3 py-1 rounded-full text-xs font-bold">
            {badge}
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-primary-foreground leading-tight">{title}</h3>
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
          <Calendar className="w-4 h-4" strokeWidth={2.5} />
          <span className="font-medium">{date}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
          <MapPin className="w-4 h-4" strokeWidth={2.5} />
          <span className="font-medium">{venue}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">From {price}</span>
          <button className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">
            Tickets
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
