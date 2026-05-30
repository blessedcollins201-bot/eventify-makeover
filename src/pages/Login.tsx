import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, User as UserIcon, Eye, EyeOff, Ticket, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { setUser } from "@/lib/auth";

const Login = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mode, setMode] = useState<"login" | "signup">(pathname === "/signup" ? "signup" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const safeName =
        mode === "signup" && name.trim()
          ? name.trim()
          : email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      setUser({
        name: safeName,
        email,
        joined: new Date().toISOString(),
        avatarSeed: email,
      });
      setLoading(false);
      navigate("/dashboard");
    }, 600);
  };

  const social = (provider: string) => {
    setUser({
      name: `${provider} Fan`,
      email: `fan@${provider.toLowerCase()}.com`,
      joined: new Date().toISOString(),
      avatarSeed: provider,
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full bg-primary/40 blur-3xl" />
          <div className="absolute bottom-0 -right-32 w-[460px] h-[460px] rounded-full bg-accent/30 blur-3xl" />
        </div>
        <Link to="/" className="relative flex items-center gap-2 z-10 w-fit">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Ticket className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-black text-lg tracking-tight">ticketmaster</span>
        </Link>

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/10 text-background text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3 h-3" /> Live tonight
          </span>
          <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.05] mb-6">
            Your front-row seat to everything.
          </h1>
          <p className="text-background/60 font-medium max-w-md leading-relaxed">
            Sign in to unlock presales, save events, manage mobile tickets, and earn rewards on every order.
          </p>

          <div className="mt-10 grid gap-4 max-w-md">
            {[
              { icon: Zap, title: "Presale access", body: "Get tickets 48h before the public drop." },
              { icon: ShieldCheck, title: "100% verified", body: "Every ticket is guaranteed, or your money back." },
              { icon: Ticket, title: "Mobile tickets", body: "Tap in. No printing, no waiting." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-3 rounded-2xl bg-background/5 border border-background/10 p-4">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">{title}</p>
                  <p className="text-xs text-background/50 font-medium">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-background/40 font-medium">
          © 2026 Ticketmaster. Built for fans.
        </p>
      </div>

      {/* Right: form */}
      <div className="flex flex-col px-6 sm:px-12 py-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground/70 hover:text-foreground">
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back
          </Link>
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Ticket className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-black text-base">ticketmaster</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto py-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-2">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-muted-foreground font-medium mb-8">
              {mode === "login"
                ? "Sign in to access your tickets, saved events, and rewards."
                : "Join millions of fans. It only takes a minute."}
            </p>

            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-muted mb-6">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-2 text-sm font-bold rounded-lg transition-all ${
                    mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {m === "login" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => social("Google")}
                className="h-11 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm font-bold text-foreground flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                onClick={() => social("Apple")}
                className="h-11 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm font-bold text-foreground flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </button>
            </div>

            <div className="relative my-2 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-background text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  or with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="text-xs font-bold text-foreground mb-1.5 block uppercase tracking-wider">
                    Full name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Taylor Swift"
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-foreground mb-1.5 block uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Password
                  </label>
                  {mode === "login" && (
                    <button type="button" className="text-xs font-bold text-primary hover:underline">
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 pl-10 pr-11 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <label className="flex items-start gap-2 text-xs text-muted-foreground font-medium">
                  <input type="checkbox" required className="mt-0.5 accent-primary" />
                  <span>
                    I agree to the{" "}
                    <Link to="/legal/terms-of-use" className="text-foreground font-bold hover:underline">
                      Terms
                    </Link>{" "}
                    &{" "}
                    <Link to="/legal/privacy-policy" className="text-foreground font-bold hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? "Just a moment…" : mode === "login" ? "Sign in" : "Create account"}
              </motion.button>
            </form>

            <p className="text-center text-sm text-muted-foreground font-medium mt-6">
              {mode === "login" ? "New to Ticketmaster?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-primary font-bold hover:underline"
              >
                {mode === "login" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;