import { Search } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-concert.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <img
        src={heroBg}
        alt="Live concert atmosphere"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center px-4 max-w-3xl mx-auto"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-primary-foreground mb-4 leading-[1.1]">
          Live events.
          <br />
          <span className="text-gradient">Unforgettable moments.</span>
        </h1>
        <p className="text-lg sm:text-xl text-primary-foreground/70 mb-8 font-medium">
          Find and buy verified tickets for concerts, sports, theater and more.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="flex items-center bg-background rounded-2xl shadow-2xl overflow-hidden">
            <Search className="w-5 h-5 text-muted-foreground ml-5 shrink-0" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search for artists, events, or venues..."
              className="w-full px-4 py-4 text-base font-medium text-foreground placeholder:text-muted-foreground bg-transparent outline-none"
            />
            <button className="mr-2 px-6 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity shrink-0">
              Search
            </button>
          </div>
        </div>

        {/* Quick tags */}
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          {["Trending", "This Weekend", "Near You", "Just Announced"].map((tag) => (
            <button
              key={tag}
              className="px-4 py-1.5 rounded-full text-sm font-semibold bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20 backdrop-blur-sm transition-colors border border-primary-foreground/10"
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
