import { useState } from "react";
import { Music, Trophy, Drama, Laugh, Zap, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { label: "All Events", icon: Zap },
  { label: "Concerts", icon: Music },
  { label: "Sports", icon: Trophy },
  { label: "Theater", icon: Drama },
  { label: "Comedy", icon: Laugh },
  { label: "Festivals", icon: PartyPopper },
];

const CategoryPills = () => {
  const [active, setActive] = useState("All Events");

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = active === cat.label;
        return (
          <button
            key={cat.label}
            onClick={() => setActive(cat.label)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="w-4 h-4" strokeWidth={2.5} />
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPills;
