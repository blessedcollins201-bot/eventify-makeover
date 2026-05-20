import { motion } from "framer-motion";
import { useState } from "react";

export interface SeatSection {
  id: string;
  label: string;
  tierId: string;
  /** SVG path for the section shape */
  d: string;
}

export interface SeatTierMeta {
  id: string;
  name: string;
  color: string; // hsl var reference
  price: number;
}

interface SeatingMapProps {
  tiers: SeatTierMeta[];
  activeTierId: string;
  onSelectTier: (tierId: string) => void;
}

/**
 * Stylized bowl-style venue seating chart.
 * Sections are grouped by tier — clicking any section selects that tier.
 */
const sections: SeatSection[] = [
  // VIP — pit, immediately in front of stage
  { id: "pit-l", tierId: "vip", label: "Pit L", d: "M180,120 L260,120 L260,170 L180,170 Z" },
  { id: "pit-r", tierId: "vip", label: "Pit R", d: "M270,120 L350,120 L350,170 L270,170 Z" },

  // GA — floor
  { id: "ga-1", tierId: "ga", label: "Floor A", d: "M170,180 L260,180 L260,240 L160,240 Z" },
  { id: "ga-2", tierId: "ga", label: "Floor B", d: "M270,180 L360,180 L370,240 L270,240 Z" },

  // Lower bowl — curved sections
  { id: "low-1", tierId: "lower", label: "101", d: "M90,170 L160,180 L150,250 L70,235 Z" },
  { id: "low-2", tierId: "lower", label: "103", d: "M70,245 L155,260 L165,320 L75,310 Z" },
  { id: "low-3", tierId: "lower", label: "105", d: "M80,320 L170,330 L200,380 L110,380 Z" },
  { id: "low-4", tierId: "lower", label: "107", d: "M210,385 L320,385 L320,425 L210,425 Z" },
  { id: "low-5", tierId: "lower", label: "109", d: "M330,385 L420,380 L450,380 L360,425 L330,425 Z" },
  { id: "low-6", tierId: "lower", label: "111", d: "M370,330 L460,320 L450,380 L365,380 Z" },
  { id: "low-7", tierId: "lower", label: "113", d: "M375,260 L460,245 L460,310 L370,320 Z" },
  { id: "low-8", tierId: "lower", label: "115", d: "M370,180 L460,170 L460,235 L375,250 Z" },

  // Upper deck — outer ring
  { id: "up-1", tierId: "upper", label: "301", d: "M30,160 L80,165 L60,250 L20,235 Z" },
  { id: "up-2", tierId: "upper", label: "303", d: "M20,245 L65,260 L70,330 L25,315 Z" },
  { id: "up-3", tierId: "upper", label: "305", d: "M30,340 L80,335 L105,400 L55,410 Z" },
  { id: "up-4", tierId: "upper", label: "307", d: "M115,405 L210,430 L210,460 L120,455 Z" },
  { id: "up-5", tierId: "upper", label: "309", d: "M220,435 L320,435 L320,470 L220,470 Z" },
  { id: "up-6", tierId: "upper", label: "311", d: "M330,435 L420,430 L420,460 L330,470 Z" },
  { id: "up-7", tierId: "upper", label: "313", d: "M430,405 L490,400 L480,455 L420,460 Z" },
  { id: "up-8", tierId: "upper", label: "315", d: "M460,340 L510,335 L515,410 L470,410 Z" },
  { id: "up-9", tierId: "upper", label: "317", d: "M465,250 L515,235 L520,315 L470,330 Z" },
  { id: "up-10", tierId: "upper", label: "319", d: "M460,165 L510,160 L520,235 L470,245 Z" },
];

const SeatingMap = ({ tiers, activeTierId, onSelectTier }: SeatingMapProps) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const getColor = (tierId: string) => {
    const t = tiers.find((tier) => tier.id === tierId);
    return t?.color ?? "hsl(var(--muted))";
  };

  const hoveredSection = sections.find((s) => s.id === hovered);
  const hoveredTier = hoveredSection
    ? tiers.find((t) => t.id === hoveredSection.tierId)
    : null;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-primary">
            Interactive Seating
          </div>
          <h3 className="text-lg font-black tracking-tight text-foreground">
            Tap a section to select a tier
          </h3>
        </div>
        {hoveredTier && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-right"
          >
            <div className="text-xs font-bold text-muted-foreground">
              {hoveredSection?.label} · {hoveredTier.name}
            </div>
            <div className="text-sm font-black text-foreground">
              from ${hoveredTier.price}
            </div>
          </motion.div>
        )}
      </div>

      <div className="relative p-4 bg-gradient-to-br from-secondary/50 via-background to-secondary/30">
        <svg
          viewBox="0 0 540 500"
          className="w-full h-auto"
          role="img"
          aria-label="Venue seating map"
        >
          {/* Stage */}
          <defs>
            <linearGradient id="stage-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect
            x="150"
            y="60"
            width="230"
            height="44"
            rx="12"
            fill="url(#stage-grad)"
            filter="url(#glow)"
          />
          <text
            x="265"
            y="88"
            textAnchor="middle"
            className="fill-primary-foreground"
            style={{ font: "700 14px Inter, sans-serif", letterSpacing: "3px" }}
          >
            STAGE
          </text>

          {/* Sections */}
          {sections.map((s) => {
            const isActive = s.tierId === activeTierId;
            const isHovered = hovered === s.id;
            return (
              <g key={s.id}>
                <motion.path
                  d={s.d}
                  fill={getColor(s.tierId)}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : isHovered ? 0.95 : 0.55,
                    scale: isHovered ? 1.02 : 1,
                  }}
                  style={{ transformOrigin: "center", transformBox: "fill-box" }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onSelectTier(s.tierId)}
                />
                <text
                  x={getCenterX(s.d)}
                  y={getCenterY(s.d)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none fill-primary-foreground"
                  style={{ font: "700 10px Inter, sans-serif" }}
                >
                  {s.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 border-t border-border bg-card">
        {tiers.map((t) => {
          const active = t.id === activeTierId;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTier(t.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-left ${
                active
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted"
              }`}
            >
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ background: t.color }}
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-foreground truncate">
                  {t.name}
                </div>
                <div className="text-[11px] text-muted-foreground font-medium">
                  from ${t.price}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Quick centroid approximation from path "M x,y L ... Z" — averages numeric pairs.
function getCenterX(d: string) {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const xs = nums.filter((_, i) => i % 2 === 0);
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}
function getCenterY(d: string) {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const ys = nums.filter((_, i) => i % 2 === 1);
  return ys.reduce((a, b) => a + b, 0) / ys.length;
}

export default SeatingMap;