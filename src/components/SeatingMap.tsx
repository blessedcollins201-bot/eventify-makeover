import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { TierId, TierInventory } from "@/data/events";
import { Accessibility, Beer, BookmarkPlus, Filter, Share2, Star, Trash2, Users, Utensils, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

/** Static venue topology — capacity/remaining come from event inventory at runtime. */
interface SectionTopology {
  id: string;
  label: string;
  tierId: TierId;
  d: string;
  /** Relative size of this section within its tier (used to distribute capacity). */
  weight: number;
  /** 0–1, higher = better view → sells out first. */
  appeal: number;
  /** Amenities/accessibility flags exposed via filters. */
  amenities: AmenityId[];
}

export interface SeatSection extends SectionTopology {
  capacity: number;
  remaining: number;
}

export interface SeatTierMeta {
  id: TierId;
  name: string;
  color: string; // hsl var reference
  price: number;
}

export type AmenityId =
  | "wheelchair"
  | "aisle"
  | "covered"
  | "bar"
  | "concessions"
  | "family";

const AMENITY_META: { id: AmenityId; label: string; icon: typeof Accessibility }[] = [
  { id: "wheelchair", label: "Wheelchair access", icon: Accessibility },
  { id: "aisle", label: "Aisle seats", icon: Users },
  { id: "covered", label: "Covered / shaded", icon: Filter },
  { id: "bar", label: "Bar access", icon: Beer },
  { id: "concessions", label: "Near concessions", icon: Utensils },
  { id: "family", label: "Family section", icon: Users },
];

// ---- Filter presets ----
interface FilterPreset {
  id: string;
  name: string;
  builtIn?: boolean;
  tiers: TierId[];
  amenities: AmenityId[];
  availableOnly: boolean;
  /** 'cheapest' | 'all' | [min,max] – resolved against current event price bounds. */
  price: "cheapest" | "all" | [number, number];
}

const BUILTIN_PRESETS: FilterPreset[] = [
  {
    id: "accessible-value",
    name: "Accessible + Best Value",
    builtIn: true,
    tiers: [],
    amenities: ["wheelchair"],
    availableOnly: true,
    price: "cheapest",
  },
  {
    id: "premium-view",
    name: "Premium View",
    builtIn: true,
    tiers: ["vip", "lower"],
    amenities: ["bar"],
    availableOnly: true,
    price: "all",
  },
  {
    id: "family",
    name: "Family-Friendly",
    builtIn: true,
    tiers: [],
    amenities: ["family", "concessions"],
    availableOnly: true,
    price: "all",
  },
  {
    id: "available",
    name: "Available Only",
    builtIn: true,
    tiers: [],
    amenities: [],
    availableOnly: true,
    price: "all",
  },
];

const PRESETS_STORAGE_KEY = "tm-seatmap-presets";
const PRESET_QUERY_PARAM = "seats";

/** Encode a preset into a compact URL-safe query string value. */
function encodePresetToParam(preset: FilterPreset): string {
  const payload = {
    n: preset.name,
    t: preset.tiers,
    a: preset.amenities,
    o: preset.availableOnly ? 1 : 0,
    p:
      preset.price === "cheapest"
        ? "c"
        : preset.price === "all"
          ? "a"
          : [preset.price[0], preset.price[1]],
  };
  const json = JSON.stringify(payload);
  // base64url
  const b64 =
    typeof btoa !== "undefined" ? btoa(unescape(encodeURIComponent(json))) : json;
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodePresetFromParam(value: string): FilterPreset | null {
  try {
    const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof atob !== "undefined"
        ? decodeURIComponent(escape(atob(b64)))
        : b64;
    const data = JSON.parse(json);
    const price: FilterPreset["price"] =
      data.p === "c"
        ? "cheapest"
        : data.p === "a"
          ? "all"
          : Array.isArray(data.p) && data.p.length === 2
            ? [Number(data.p[0]), Number(data.p[1])]
            : "all";
    return {
      id: `shared-${value.slice(0, 16)}`,
      name: typeof data.n === "string" && data.n.trim() ? data.n : "Shared search",
      tiers: Array.isArray(data.t) ? (data.t as TierId[]) : [],
      amenities: Array.isArray(data.a) ? (data.a as AmenityId[]) : [],
      availableOnly: !!data.o,
      price,
    };
  } catch {
    return null;
  }
}

interface SeatingMapProps {
  tiers: SeatTierMeta[];
  activeTierId: string;
  onSelectTier: (tierId: TierId) => void;
  /** Per-tier inventory for this specific event. */
  inventory: Record<TierId, TierInventory>;
}

/**
 * Static bowl-style venue topology. Capacity weight + appeal determine how each
 * event's per-tier inventory is distributed across sections — premium seats
 * (higher appeal) sell out first.
 */
const topology: SectionTopology[] = [
  // VIP — pit, immediately in front of stage
  { id: "pit-l", tierId: "vip", label: "Pit L", d: "M180,120 L260,120 L260,170 L180,170 Z", weight: 1, appeal: 0.95, amenities: ["bar", "aisle"] },
  { id: "pit-r", tierId: "vip", label: "Pit R", d: "M270,120 L350,120 L350,170 L270,170 Z", weight: 1, appeal: 1.0, amenities: ["bar"] },

  // GA — floor
  { id: "ga-1", tierId: "ga", label: "Floor A", d: "M170,180 L260,180 L260,240 L160,240 Z", weight: 1, appeal: 0.8, amenities: ["concessions"] },
  { id: "ga-2", tierId: "ga", label: "Floor B", d: "M270,180 L360,180 L370,240 L270,240 Z", weight: 1, appeal: 0.85, amenities: ["concessions", "bar"] },

  // Lower bowl — curved sections
  { id: "low-1", tierId: "lower", label: "101", d: "M90,170 L160,180 L150,250 L70,235 Z", weight: 1.0, appeal: 0.7, amenities: ["aisle", "bar"] },
  { id: "low-2", tierId: "lower", label: "103", d: "M70,245 L155,260 L165,320 L75,310 Z", weight: 1.0, appeal: 0.5, amenities: ["wheelchair", "aisle"] },
  { id: "low-3", tierId: "lower", label: "105", d: "M80,320 L170,330 L200,380 L110,380 Z", weight: 1.0, appeal: 0.4, amenities: ["concessions"] },
  { id: "low-4", tierId: "lower", label: "107", d: "M210,385 L320,385 L320,425 L210,425 Z", weight: 1.15, appeal: 0.3, amenities: ["family", "concessions"] },
  { id: "low-5", tierId: "lower", label: "109", d: "M330,385 L420,380 L450,380 L360,425 L330,425 Z", weight: 1.15, appeal: 0.35, amenities: ["family"] },
  { id: "low-6", tierId: "lower", label: "111", d: "M370,330 L460,320 L450,380 L365,380 Z", weight: 1.0, appeal: 0.45, amenities: ["concessions"] },
  { id: "low-7", tierId: "lower", label: "113", d: "M375,260 L460,245 L460,310 L370,320 Z", weight: 1.0, appeal: 0.55, amenities: ["wheelchair", "aisle"] },
  { id: "low-8", tierId: "lower", label: "115", d: "M370,180 L460,170 L460,235 L375,250 Z", weight: 1.0, appeal: 0.75, amenities: ["bar", "aisle"] },

  // Upper deck — outer ring
  { id: "up-1",  tierId: "upper", label: "301", d: "M30,160 L80,165 L60,250 L20,235 Z", weight: 1, appeal: 0.7,  amenities: ["covered", "aisle"] },
  { id: "up-2",  tierId: "upper", label: "303", d: "M20,245 L65,260 L70,330 L25,315 Z", weight: 1, appeal: 0.55, amenities: ["covered", "wheelchair"] },
  { id: "up-3",  tierId: "upper", label: "305", d: "M30,340 L80,335 L105,400 L55,410 Z", weight: 1, appeal: 0.4,  amenities: ["covered", "concessions"] },
  { id: "up-4",  tierId: "upper", label: "307", d: "M115,405 L210,430 L210,460 L120,455 Z", weight: 1, appeal: 0.25, amenities: ["covered", "family"] },
  { id: "up-5",  tierId: "upper", label: "309", d: "M220,435 L320,435 L320,470 L220,470 Z", weight: 1, appeal: 0.2,  amenities: ["covered", "family", "concessions"] },
  { id: "up-6",  tierId: "upper", label: "311", d: "M330,435 L420,430 L420,460 L330,470 Z", weight: 1, appeal: 0.3,  amenities: ["covered", "family"] },
  { id: "up-7",  tierId: "upper", label: "313", d: "M430,405 L490,400 L480,455 L420,460 Z", weight: 1, appeal: 0.45, amenities: ["covered", "concessions"] },
  { id: "up-8",  tierId: "upper", label: "315", d: "M460,340 L510,335 L515,410 L470,410 Z", weight: 1, appeal: 0.5,  amenities: ["covered", "wheelchair"] },
  { id: "up-9",  tierId: "upper", label: "317", d: "M465,250 L515,235 L520,315 L470,330 Z", weight: 1, appeal: 0.6,  amenities: ["covered", "aisle"] },
  { id: "up-10", tierId: "upper", label: "319", d: "M460,165 L510,160 L520,235 L470,245 Z", weight: 1, appeal: 0.75, amenities: ["covered", "bar"] },
];

/**
 * Distribute a tier's total capacity & remaining across its sections.
 * - Capacity is split by `weight` (rounded, residual to the highest-weight section).
 * - Sold seats fill highest-appeal sections first so the best seats go first.
 */
function distributeTier(
  sections: SectionTopology[],
  tierCapacity: number,
  tierRemaining: number,
): Map<string, { capacity: number; remaining: number }> {
  const result = new Map<string, { capacity: number; remaining: number }>();
  if (sections.length === 0) return result;

  const totalWeight = sections.reduce((s, x) => s + x.weight, 0) || 1;
  const capacities = sections.map((s) =>
    Math.max(0, Math.floor((s.weight / totalWeight) * tierCapacity)),
  );
  // Push capacity residual into the highest-weight section
  let residual = tierCapacity - capacities.reduce((a, b) => a + b, 0);
  if (residual !== 0) {
    const idx = sections.reduce(
      (best, s, i) => (s.weight > sections[best].weight ? i : best),
      0,
    );
    capacities[idx] += residual;
  }

  const clampedCap = Math.max(0, Math.min(tierCapacity, tierRemaining));
  let sold = tierCapacity - clampedCap;

  // Sell highest-appeal sections first.
  const order = sections
    .map((s, i) => ({ i, appeal: s.appeal }))
    .sort((a, b) => b.appeal - a.appeal);

  const remainingPerIdx = capacities.slice();
  for (const { i } of order) {
    if (sold <= 0) break;
    const take = Math.min(remainingPerIdx[i], sold);
    remainingPerIdx[i] -= take;
    sold -= take;
  }

  sections.forEach((s, i) => {
    result.set(s.id, { capacity: capacities[i], remaining: remainingPerIdx[i] });
  });
  return result;
}

type Availability = "sold-out" | "low" | "available";
const getAvailability = (s: SeatSection): Availability => {
  if (s.capacity <= 0 || s.remaining <= 0) return "sold-out";
  if (s.remaining / s.capacity <= 0.15) return "low";
  return "available";
};

const SeatingMap = ({ tiers, activeTierId, onSelectTier, inventory }: SeatingMapProps) => {
  const [hovered, setHovered] = useState<string | null>(null);
  // ---- Filters ----
  const [tierFilter, setTierFilter] = useState<Set<TierId>>(new Set());
  const [amenityFilter, setAmenityFilter] = useState<Set<AmenityId>>(new Set());
  const [availableOnly, setAvailableOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);

  // ---- Presets ----
  const [userPresets, setUserPresets] = useState<FilterPreset[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [savingPreset, setSavingPreset] = useState(false);
  const [presetName, setPresetName] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (raw) setUserPresets(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(userPresets));
    } catch {
      /* ignore */
    }
  }, [userPresets]);

  // Derive per-section capacity & remaining from the event's tier inventory.
  const sections = useMemo<SeatSection[]>(() => {
    const byTier = new Map<TierId, SectionTopology[]>();
    topology.forEach((t) => {
      const arr = byTier.get(t.tierId) ?? [];
      arr.push(t);
      byTier.set(t.tierId, arr);
    });
    const merged = new Map<string, { capacity: number; remaining: number }>();
    byTier.forEach((tierSections, tierId) => {
      const inv = inventory[tierId] ?? { capacity: 0, remaining: 0 };
      const dist = distributeTier(tierSections, inv.capacity, inv.remaining);
      dist.forEach((v, k) => merged.set(k, v));
    });
    return topology
      .map((t) => {
        const m = merged.get(t.id) ?? { capacity: 0, remaining: 0 };
        return { ...t, capacity: m.capacity, remaining: m.remaining };
      })
      // Hide sections for tiers with zero capacity at this event
      .filter((s) => s.capacity > 0);
  }, [inventory]);

  // Tiers that actually have inventory for this event — used by the filter chips.
  const availableTiers = useMemo(
    () => tiers.filter((t) => (inventory[t.id]?.capacity ?? 0) > 0),
    [tiers, inventory],
  );

  // Price bounds across this event's tiers.
  const [priceMin, priceMax] = useMemo(() => {
    if (availableTiers.length === 0) return [0, 0];
    const prices = availableTiers.map((t) => t.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [availableTiers]);

  const effectivePriceRange: [number, number] =
    priceRange ?? [priceMin, priceMax];

  // Determine whether a section matches the active filters.
  const matchesFilters = (s: SeatSection): boolean => {
    const tier = tiers.find((t) => t.id === s.tierId);
    if (!tier) return false;
    if (tierFilter.size > 0 && !tierFilter.has(s.tierId)) return false;
    if (
      tier.price < effectivePriceRange[0] ||
      tier.price > effectivePriceRange[1]
    )
      return false;
    if (amenityFilter.size > 0) {
      for (const a of amenityFilter) if (!s.amenities.includes(a)) return false;
    }
    if (availableOnly && s.remaining <= 0) return false;
    return true;
  };

  const visibleSections = useMemo(
    () => sections.filter(matchesFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sections, tierFilter, amenityFilter, availableOnly, effectivePriceRange[0], effectivePriceRange[1]],
  );

  const filtersActive =
    tierFilter.size > 0 ||
    amenityFilter.size > 0 ||
    availableOnly ||
    (priceRange !== null &&
      (priceRange[0] !== priceMin || priceRange[1] !== priceMax));

  const clearFilters = () => {
    setTierFilter(new Set());
    setAmenityFilter(new Set());
    setAvailableOnly(false);
    setPriceRange(null);
    setActivePresetId(null);
  };

  const toggleTier = (id: TierId) => {
    setTierFilter((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setActivePresetId(null);
  };
  const toggleAmenity = (id: AmenityId) => {
    setAmenityFilter((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setActivePresetId(null);
  };

  const applyPreset = (preset: FilterPreset) => {
    setTierFilter(new Set(preset.tiers));
    setAmenityFilter(new Set(preset.amenities));
    setAvailableOnly(preset.availableOnly);
    if (preset.price === "all" || priceMax === priceMin) {
      setPriceRange(null);
    } else if (preset.price === "cheapest") {
      // Bottom ~50% of the price range
      const mid = Math.round(priceMin + (priceMax - priceMin) * 0.5);
      setPriceRange([priceMin, mid]);
    } else {
      setPriceRange([
        Math.max(priceMin, preset.price[0]),
        Math.min(priceMax, preset.price[1]),
      ]);
    }
    setActivePresetId(preset.id);
  };

  const saveCurrentAsPreset = () => {
    const name = presetName.trim();
    if (!name) return;
    const preset: FilterPreset = {
      id: `user-${Date.now()}`,
      name,
      tiers: Array.from(tierFilter),
      amenities: Array.from(amenityFilter),
      availableOnly,
      price:
        priceRange &&
        (priceRange[0] !== priceMin || priceRange[1] !== priceMax)
          ? [priceRange[0], priceRange[1]]
          : "all",
    };
    setUserPresets((prev) => [...prev, preset]);
    setActivePresetId(preset.id);
    setPresetName("");
    setSavingPreset(false);
  };

  const deletePreset = (id: string) => {
    setUserPresets((prev) => prev.filter((p) => p.id !== id));
    if (activePresetId === id) setActivePresetId(null);
  };

  const sharePreset = async (preset: FilterPreset) => {
    const param = encodePresetToParam(preset);
    const url = new URL(window.location.href);
    url.searchParams.set(PRESET_QUERY_PARAM, param);
    const shareUrl = url.toString();
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Seating search: ${preset.name}`,
          text: `Check out my seating filters: ${preset.name}`,
          url: shareUrl,
        });
        return;
      }
    } catch {
      /* fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied", {
        description: `"${preset.name}" — paste it anywhere to share these filters.`,
      });
    } catch {
      toast.error("Could not copy link", { description: shareUrl });
    }
  };

  // Apply a shared preset from ?seats=... on first mount (per event).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(PRESET_QUERY_PARAM);
    if (!raw) return;
    const shared = decodePresetFromParam(raw);
    if (!shared) return;
    setUserPresets((prev) =>
      prev.some((p) => p.id === shared.id) ? prev : [shared, ...prev],
    );
    applyPreset(shared);
    toast("Loaded shared seating search", {
      description: `"${shared.name}" applied to the seating map.`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceMin, priceMax]);

  const getColor = (tierId: string) => {
    const t = tiers.find((tier) => tier.id === tierId);
    return t?.color ?? "hsl(var(--muted))";
  };

  const hoveredSection = sections.find((s) => s.id === hovered);
  const hoveredTier = hoveredSection
    ? tiers.find((t) => t.id === hoveredSection.tierId)
    : null;
  const hoveredAvail = hoveredSection ? getAvailability(hoveredSection) : null;

  const totalRemaining = visibleSections.reduce((sum, s) => sum + s.remaining, 0);
  const totalCapacity = visibleSections.reduce((sum, s) => sum + s.capacity, 0);
  const soldOutCount = visibleSections.filter((s) => getAvailability(s) === "sold-out").length;

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
            {filtersActive ? (
              <>
                {visibleSections.length} of {sections.length} sections match ·{" "}
                {totalRemaining.toLocaleString()} seats left
              </>
            ) : (
              <>
                {totalRemaining.toLocaleString()} of {totalCapacity.toLocaleString()} seats left
                {soldOutCount > 0 && ` · ${soldOutCount} sections sold out`}
              </>
            )}
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

      {/* Filters */}
      <div className="px-5 py-4 border-b border-border bg-muted/30 space-y-3">
        {/* Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-foreground/70">
              <Star className="w-3 h-3" /> Presets
            </div>
            <button
              type="button"
              onClick={() => setSavingPreset((s) => !s)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-foreground"
            >
              <BookmarkPlus className="w-3 h-3" />
              {savingPreset ? "Cancel" : "Save current"}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[...BUILTIN_PRESETS, ...userPresets].map((p) => {
              const active = activePresetId === p.id;
              return (
                <div key={p.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => applyPreset(p)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 pl-2.5 ${
                      p.builtIn ? "pr-2.5" : "pr-6"
                    } py-1 rounded-full border text-[11px] font-bold transition-all ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground/80 hover:border-foreground/40"
                    }`}
                  >
                    {p.builtIn && <Star className="w-3 h-3" strokeWidth={2.5} />}
                    {p.name}
                  </button>
                  {!p.builtIn && (
                    <button
                      type="button"
                      onClick={() => deletePreset(p.id)}
                      aria-label={`Delete ${p.name} preset`}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {savingPreset && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveCurrentAsPreset()}
                placeholder="Name this preset…"
                className="flex-1 px-2.5 py-1 rounded-md border border-border bg-background text-[11px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                autoFocus
              />
              <button
                type="button"
                onClick={saveCurrentAsPreset}
                disabled={!presetName.trim() || !filtersActive}
                className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[11px] font-bold disabled:opacity-50"
              >
                Save
              </button>
            </div>
          )}
          {savingPreset && !filtersActive && (
            <div className="text-[11px] font-medium text-muted-foreground">
              Apply some filters first, then save them as a preset.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-foreground/80">
            <Filter className="w-3.5 h-3.5" /> Filters
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-[11px] font-bold text-foreground/80 cursor-pointer">
              <Switch
                checked={availableOnly}
                onCheckedChange={(v) => {
                  setAvailableOnly(v);
                  setActivePresetId(null);
                }}
              />
              Available only
            </label>
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Tier chips */}
        <div className="flex flex-wrap gap-1.5">
          {availableTiers.map((t) => {
            const active = tierFilter.has(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTier(t.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground/80 hover:border-foreground/40"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-sm shrink-0"
                  style={{ background: t.color }}
                />
                {t.name} · ${t.price}
              </button>
            );
          })}
        </div>

        {/* Price range */}
        {priceMax > priceMin && (
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground mb-1.5">
              <span>Price range</span>
              <span className="text-foreground">
                ${effectivePriceRange[0]} – ${effectivePriceRange[1]}
              </span>
            </div>
            <Slider
              min={priceMin}
              max={priceMax}
              step={1}
              value={effectivePriceRange}
              onValueChange={(v) => {
                setPriceRange([v[0] ?? priceMin, v[1] ?? priceMax]);
                setActivePresetId(null);
              }}
              className="w-full"
            />
          </div>
        )}

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5">
          {AMENITY_META.map(({ id, label, icon: Icon }) => {
            const active = amenityFilter.has(id);
            const sectionCount = sections.filter((s) => s.amenities.includes(id)).length;
            if (sectionCount === 0) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleAmenity(id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground/80 hover:border-foreground/40"
                }`}
              >
                <Icon className="w-3 h-3" strokeWidth={2.5} />
                {label}
              </button>
            );
          })}
        </div>

        {visibleSections.length === 0 && (
          <div className="text-[11px] font-bold text-destructive">
            No sections match these filters. Try clearing some.
          </div>
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
            const matches = matchesFilters(s);
            const dimmed = filtersActive && !matches;
            const interactive = !soldOut && matches;
            return (
              <g key={s.id}>
                <motion.path
                  d={s.d}
                  fill={soldOut ? "url(#sold-out-hatch)" : tierColor}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                  initial={false}
                  animate={{
                    opacity: dimmed
                      ? 0.15
                      : soldOut
                      ? 0.85
                      : isActive
                      ? 1
                      : isHovered
                      ? 0.95
                      : 0.55,
                    scale: interactive && isHovered ? 1.02 : 1,
                  }}
                  style={{ transformOrigin: "center", transformBox: "fill-box" }}
                  whileTap={interactive ? { scale: 0.97 } : undefined}
                  className={
                    interactive ? "cursor-pointer" : "cursor-not-allowed"
                  }
                  onMouseEnter={() => !dimmed && setHovered(s.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => interactive && onSelectTier(s.tierId)}
                />
                {/* Low-availability pulse ring */}
                {low && !dimmed && (
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
                  style={{
                    font: "700 10px Inter, sans-serif",
                    opacity: dimmed ? 0.25 : 1,
                  }}
                >
                  {s.label}
                </text>
                {low && !dimmed && (
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