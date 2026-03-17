import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EventCard from "@/components/EventCard";
import CategoryPills from "@/components/CategoryPills";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import eventRock from "@/assets/event-rock.jpg";
import eventSports from "@/assets/event-sports.jpg";
import eventTheater from "@/assets/event-theater.jpg";
import eventPop from "@/assets/event-pop.jpg";
import eventEdm from "@/assets/event-edm.jpg";
import eventComedy from "@/assets/event-comedy.jpg";

const events = [
  { image: eventPop, title: "The Weeknd – After Hours World Tour", date: "Apr 12, 2026 • 8:00 PM", venue: "Madison Square Garden, NY", price: "$89", badge: "On Sale Now" },
  { image: eventSports, title: "NBA Playoffs – Lakers vs Celtics", date: "Apr 18, 2026 • 7:30 PM", venue: "Crypto.com Arena, LA", price: "$145", badge: "Low Tickets" },
  { image: eventTheater, title: "Hamilton – Broadway", date: "Apr 22, 2026 • 7:00 PM", venue: "Richard Rodgers Theatre, NY", price: "$199" },
  { image: eventRock, title: "Foo Fighters – The Last Stand Tour", date: "May 3, 2026 • 8:00 PM", venue: "Wembley Stadium, London", price: "$75" },
  { image: eventEdm, title: "Calvin Harris – Summerfest", date: "May 15, 2026 • 10:00 PM", venue: "Las Vegas Festival Grounds", price: "$120", badge: "Just Announced" },
  { image: eventComedy, title: "John Mulaney – Live in Chicago", date: "May 20, 2026 • 9:00 PM", venue: "Chicago Theatre, IL", price: "$65" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Trending Events
            </h2>
            <p className="text-muted-foreground font-medium mt-1">
              Don't miss the hottest events happening near you
            </p>
          </div>
          <button className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
            View All <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryPills />
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <EventCard key={event.title} {...event} index={i} />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl text-base hover:opacity-90 transition-opacity shadow-lg"
          >
            Explore All Events
          </motion.button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
              Never miss a moment
            </h2>
            <p className="text-muted-foreground font-medium text-lg max-w-lg mx-auto mb-8">
              Get personalized event recommendations and exclusive presale access delivered to your inbox.
            </p>
            <div className="flex items-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground font-medium text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button className="px-6 py-3.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity shrink-0">
                Sign Up
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
