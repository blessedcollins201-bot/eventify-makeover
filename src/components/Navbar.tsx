import { Search, MapPin, User, Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = ["Concerts", "Sports", "Arts & Theater", "Family", "VIP"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-sm">TM</span>
            </div>
            <span className="font-black text-lg tracking-tight text-foreground hidden sm:block">
              ticketmaster
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link}
                className="px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <MapPin className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <User className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <button
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link}
                  className="px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground text-left rounded-lg hover:bg-secondary transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
