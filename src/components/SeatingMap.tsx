import { motion } from "framer-motion";
import { useState } from "react";

export interface SeatSection {
  id: string;
  label: string;
  tierId: string;
  /** SVG path for the section shape */
  d: string;
  /** Total seats in this section */
  capacity: number;
  /** Seats still available */
  remaining: number;
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
  { id: "pit-l", tierId: "vip", label: "Pit L", d: "M180,120 L260,120 L260,170 L180,170 Z", capacity: 40, remaining: 6 },
  { id: "pit-r", tierId: "vip", label: "Pit R", d: "M270,120 L350,120 L350,170 L270,170 Z", capacity: 40, remaining: 0 },

  // GA — floor
  { id: "ga-1", tierId: "ga", label: "Floor A", d: "M170,180 L260,180 L260,240 L160,240 Z", capacity: 200, remaining: 84 },
  { id: "ga-2", tierId: "ga", label: "Floor B", d: "M270,180 L360,180 L370,240 L270,240 Z", capacity: 200, remaining: 58 },

  // Lower bowl — curved sections
  { id: "low-1", tierId: "lower", label: "101", d: "M90,170 L160,180 L150,250 L70,235 Z", capacity: 120, remaining: 22 },
  { id: "low-2", tierId: "lower", label: "103", d: "M70,245 L155,260 L165,320 L75,310 Z", capacity: 120, remaining: 0 },
  { id: "low-3", tierId: "lower", label: "105", d: "M80,320 L170,330 L200,380 L110,380 Z", capacity: 120, remaining: 14 },
  { id: "low-4", tierId: "lower", label: "107", d: "M210,385 L320,385 L320,425 L210,425 Z", capacity: 140, remaining: 76 },
  { id: "low-5", tierId: "lower", label: "109", d: "M330,385 L420,380 L450,380 L360,425 L330,425 Z", capacity: 140, remaining: 9 },
  { id: "low-6", tierId: "lower", label: "111", d: "M370,330 L460,320 L450,380 L365,380 Z", capacity: 120, remaining: 0 },
  { id: "low-7", tierId: "lower", label: "113", d: "M375,260 L460,245 L460,310 L370,320 Z", capacity: 120, remaining: 41 },
  { id: "low-8", tierId: "lower", label: "115", d: "M370,180 L460,170 L460,235 L375,250 Z", capacity: 120, remaining: 63 },

  // Upper deck — outer ring
  { id: "up-1", tierId: "upper", label: "301", d: "M30,160 L80,165 L60,250 L20,235 Z", capacity: 180, remaining: 132 },
  { id: "up-2", tierId: "upper", label: "303", d: "M20,245 L65,260 L70,330 L25,315 Z", capacity: 180, remaining: 108 },
  { id: "up-3", tierId: "upper", label: "305", d: "M30,340 L80,335 L105,400 L55,410 Z", capacity: 180, remaining: 0 },
  { id: "up-4", tierId: "upper", label: "307", d: "M115,405 L210,430 L210,460 L120,455 Z", capacity: 180, remaining: 91 },
  { id: "up-5", tierId: "upper", label: "309", d: "M220,435 L320,435 L320,470 L220,470 Z", capacity: 180, remaining: 156 },
  { id: "up-6", tierId: "upper", label: "311", d: "M330,435 L420,430 L420,460 L330,470 Z", capacity: 180, remaining: 17 },
  { id: "up-7", tierId: "upper", label: "313", d: "M430,405 L490,400 L480,455 L420,460 Z", capacity: 180, remaining: 74 },
  { id: "up-8", tierId: "upper", label: "315", d: "M460,340 L510,335 L515,410 L470,410 Z", capacity: 180, remaining: 0 },
  { id: "up-9", tierId: "upper", label: "317", d: "M465,250 L515,235 L520,315 L470,330 Z", capacity: 180, remaining: 122 },
  { id: "up-10", tierId: "upper", label: "319", d: "M460,165 L510,160 L520,235 L470,245 Z", capacity: 180, remaining: 48 },
];

type Availability = "sold-out" | "low" | "available";
const getAvailability = (s: SeatSection): Availability => {
  if (s.remaining <= 0) return "sold-out";
  if (s.remaining / s.capacity <= 0.15) return "low";
  return "available";
};

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
  const hoveredAvail = hoveredSection ? getAvailability(hoveredSection) : null;

  const totalRemaining = sections.reduce((sum, s) => sum + s.remaining, 0);
  const totalCapacity = sections.reduce((sum, s) => sum + s.capacity, 0);
  const soldOutCount = sections.filter((s) => getAvailability(s) === "sold-out").length;

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
          <div className="text-[11px] text-muted-foreground font-medium mt-1">
            {totalRemaining.toLocaleString()} of {totalCapacity.toLocaleString()} seats left
            {soldOutCount > 0 && ` · ${soldOutCount} sections sold out`}
          </div>
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
              {hoveredAvail === "sold-out"
                ? "Sold out"
                : `${hoveredSection?.remaining} left · from $${hoveredTier.price}`}
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
            <pattern
              id="sold-out-hatch"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <rect width="6" height="6" fill="hsl(var(--muted))" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1.5"
                opacity="0.45"
              />
            </pattern>
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
            const avail = getAvailability(s);
            const soldOut = avail === "sold-out";
            const low = avail === "low";
            const tierColor = getColor(s.tierId);
            return (
              <g key={s.id}>
                <motion.path
                  d={s.d}
                  fill={soldOut ? "url(#sold-out-hatch)" : tierColor}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                  initial={false}
                  animate={{
                    opacity: soldOut
                      ? 0.85
                      : isActive
                      ? 1
                      : isHovered
                      ? 0.95
                      : 0.55,
                    scale: !soldOut && isHovered ? 1.02 : 1,
                  }}
                  style={{ transformOrigin: "center", transformBox: "fill-box" }}
                  whileTap={soldOut ? undefined : { scale: 0.97 }}
                  className={soldOut ? "cursor-not-allowed" : "cursor-pointer"}
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => !soldOut && onSelectTier(s.tierId)}
                />
                {/* Low-availability pulse ring */}
                {low && (
                  <motion.path
                    d={s.d}
                    fill="none"
                    stroke="hsl(var(--destructive, 0 84% 60%))"
                    strokeWidth={2}
                    pointerEvents="none"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                )}
                <text
                  x={getCenterX(s.d)}
                  y={getCenterY(s.d)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`pointer-events-none ${
                    soldOut ? "fill-muted-foreground" : "fill-primary-foreground"
                  }`}
                  style={{ font: "700 10px Inter, sans-serif" }}
                >
                  {s.label}
                </text>
                {low && (
                  <text
                    x={getCenterX(s.d)}
                    y={getCenterY(s.d) + 11}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none fill-primary-foreground"
                    style={{ font: "700 7.5px Inter, sans-serif", letterSpacing: "0.5px" }}
                  >
                    {s.remaining} LEFT
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Availability legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 pt-4 text-[11px] font-semibold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-foreground/70" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm ring-2 ring-destructive ring-offset-1 ring-offset-card" />
          Low availability
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" className="rounded-sm overflow-hidden">
            <rect width="12" height="12" fill="url(#sold-out-hatch)" />
          </svg>
          Sold out
        </span>
      </div>

      {/* Tier legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 border-t border-border bg-card mt-3">
        {tiers.map((t) => {
          const active = t.id === activeTierId;
          const tierSections = sections.filter((s) => s.tierId === t.id);
          const tierRemaining = tierSections.reduce((sum, s) => sum + s.remaining, 0);
          const tierCapacity = tierSections.reduce((sum, s) => sum + s.capacity, 0);
          const tierSoldOut = tierRemaining === 0;
          const tierLow = !tierSoldOut && tierRemaining / tierCapacity <= 0.15;
          return (
            <button
              key={t.id}
              onClick={() => !tierSoldOut && onSelectTier(t.id)}
              disabled={tierSoldOut}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-left ${
                active
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted"
              } ${tierSoldOut ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ background: t.color }}
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-foreground truncate">
                  {t.name}
                </div>
                <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                  {tierSoldOut ? (
                    <span className="font-bold text-foreground/70">Sold out</span>
                  ) : (
                    <>
                      <span>from ${t.price}</span>
                      <span aria-hidden>·</span>
                      <span className={tierLow ? "text-destructive font-bold" : ""}>
                        {tierRemaining} left
                      </span>
                    </>
                  )}
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