import { motion } from "framer-motion";
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  MapPin,
  CreditCard,
  Smartphone,
  ArrowRight,
  Ticket,
  Mail,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const footerLinks = {
  discover: {
    title: "Discover",
    links: ["Concerts", "Sports", "Arts & Theater", "Family", "VIP Experiences", "Festivals", "Comedy"],
  },
  help: {
    title: "Help",
    links: ["Customer Service", "My Account", "Order History", "FAQs", "Accessibility", "Gift Cards"],
  },
  company: {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Partners", "Investors", "Sustainability"],
  },
  legal: {
    title: "Legal",
    links: ["Terms of Use", "Privacy Policy", "Cookie Settings", "Ad Choices", "Do Not Sell", "Licenses"],
  },
  forFans: {
    title: "For Fans",
    links: ["Mobile App", "Fan Rewards", "Presales", "Ticket Insurance", "Group Sales", "Resale"],
  },
};

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

const paymentIcons = [
  { name: "Visa", color: "#1A1F71" },
  { name: "Mastercard", color: "#EB001B" },
  { name: "Amex", color: "#016FD0" },
  { name: "Discover", color: "#FF6000" },
  { name: "Apple Pay", color: "#000000" },
  { name: "Google Pay", color: "#4285F4" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-foreground text-background overflow-hidden">
      {/* Newsletter Band */}
      <div className="border-b border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Never miss a moment</h3>
                <p className="text-sm text-background/50 mt-1 max-w-md font-medium leading-relaxed">
                  Get exclusive presale alerts, last-minute ticket drops, and curated event recommendations delivered to your inbox.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="w-full max-w-md">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 pl-5 pr-36 rounded-2xl bg-background/5 border border-background/10 text-sm text-background placeholder:text-background/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="absolute right-1.5 h-9 px-5 bg-primary text-primary-foreground text-sm font-bold rounded-xl flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  {subscribed ? "Subscribed!" : "Subscribe"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-primary mt-2 font-medium"
                >
                  You're in! Check your inbox for a welcome gift.
                </motion.p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* App Download Band */}
      <div className="border-b border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-background/5 border border-background/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-background/60" />
              </div>
              <div>
                <p className="text-sm font-bold">Get the app</p>
                <p className="text-xs text-background/40 font-medium">Scan, buy, and go — tickets in your pocket.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* App Store Badge */}
              <a href="#" className="h-10 px-4 rounded-xl bg-background/5 border border-background/10 flex items-center gap-2.5 hover:bg-background/10 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="leading-none">
                  <span className="block text-[9px] text-background/40 font-medium">Download on the</span>
                  <span className="block text-xs font-bold">App Store</span>
                </div>
              </a>
              {/* Google Play Badge */}
              <a href="#" className="h-10 px-4 rounded-xl bg-background/5 border border-background/10 flex items-center gap-2.5 hover:bg-background/10 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.59.69.59 1.19s-.22.9-.57 1.18l-2.29 1.32-2.5-2.5 2.5-2.5 2.27 1.31zM6.05 2.66l10.76 6.22-2.27 2.27L6.05 2.66z"/>
                </svg>
                <div className="leading-none">
                  <span className="block text-[9px] text-background/40 font-medium">Get it on</span>
                  <span className="block text-xs font-bold">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10"
        >
          {Object.values(footerLinks).map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h4 className="font-bold text-xs mb-5 text-background/60 uppercase tracking-[0.15em]">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-background/35 hover:text-background transition-colors duration-200 font-medium"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Trust & Social Band */}
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-2 text-background/30">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-medium">Verified Tickets</span>
              </div>
              <div className="flex items-center gap-2 text-background/30">
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-medium">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2 text-background/30">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-medium">Global Events</span>
              </div>
              <div className="flex items-center gap-2 text-background/30">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium">Local Venues</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-background/5 border border-background/10 flex items-center justify-center text-background/35 hover:text-background hover:bg-background/10 transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Logo + Copyright */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Ticket className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xs text-background/40 font-medium">
                © 2026 Ticketmaster. All rights reserved.
              </span>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              {paymentIcons.map(({ name, color }) => (
                <div
                  key={name}
                  className="h-7 px-2.5 rounded-md bg-background flex items-center justify-center"
                  title={name}
                >
                  <span className="text-[9px] font-black tracking-wider" style={{ color }}>
                    {name === "Amex" ? "AMEX" : name === "Apple Pay" ? "Pay" : name === "Google Pay" ? "G Pay" : name.toUpperCase().slice(0, 4)}
                  </span>
                </div>
              ))}
            </div>

            {/* Locale */}
            <div className="flex items-center gap-4 text-xs text-background/40 font-medium">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                United States
              </span>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
