import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  Calendar,
  Users,
  Mountain,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { appendSignupToSheet } from "@/lib/sheet.functions";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import orbiesLogo from "@/assets/orbies-logo-transparent.png.asset.json";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orbies — Discover what's happening around you" },
      {
        name: "description",
        content:
          "Find communities, events, trips, volunteering opportunities and like-minded people in your city — all in one place.",
      },
      { property: "og:title", content: "Orbies — Discover what's happening around you" },
      {
        property: "og:description",
        content:
          "Find communities, events, trips, volunteering opportunities and like-minded people in your city — all in one place.",
      },
    ],
  }),
  component: Index,
});

const INTERESTS = [
  "Events",
  "Trips",
  "Communities",
  "Networking",
  "Meet New People",
  "Volunteering",
  "Startup Opportunities",
  "Sports & Fitness",
] as const;

const step1Schema = z.object({
  name: z.string().trim().min(1, "Tell us your name").max(100),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid mobile number"),
  city: z.string().trim().min(1, "Which city are you in?").max(100),
});

const CATEGORIES = [
  {
    icon: Calendar,
    title: "Events",
    tagline: "The Moments That Make Your City Worth Showing Up For.",
    desc: "Startup meetups, open mics, workshops, networking nights.",
    bg: "#ec2b6e",
    fg: "#fff7ec",
  },
  {
    icon: Users,
    title: "Communities",
    tagline: "Your People Are Out There. Stop Scrolling, Start Belonging.",
    desc: "Reading clubs, fitness crews, photography circles, founder groups.",
    bg: "#1fb59a",
    fg: "#06231d",
  },
  {
    icon: Mountain,
    title: "Trips",
    tagline: "Weekends That Don't Disappear Into Another Instagram Reel.",
    desc: "Weekend treks, group travel, bike rides and adventures.",
    bg: "#ff8a3d",
    fg: "#2a1208",
  },
  {
    icon: HeartHandshake,
    title: "Volunteering",
    tagline: "Do Something Today That Outlives The Notification.",
    desc: "NGO drives, blood donations, environmental causes.",
    bg: "#7c5cff",
    fg: "#f4f0ff",
  },
  {
    icon: Sparkles,
    title: "People",
    tagline: "The Founders, Creators And Friends You Haven't Met Yet.",
    desc: "Founders, creators, students and professionals near you.",
    bg: "#facc15",
    fg: "#2a1a00",
  },
];

function Index() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <Toaster richColors position="top-center" />
      
      <Hero onOpen={() => setOpen(true)} />
      <Categories />
      <Why />
      <Footer />
      <WaitlistDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function Nav({ onOpen }: { onOpen: () => void }) {
  return (
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
      <a href="#" className="flex items-center">
        <img src={orbiesLogo.url} alt="Orbies" className="h-16 w-auto sm:h-20" />
      </a>
      <button
        onClick={onOpen}
        className="rounded-full bg-black px-5 py-2 text-xs font-medium text-white transition-transform hover:scale-[1.03] sm:px-6 sm:py-2.5 sm:text-sm"
      >
        Log in to explore
      </button>
    </nav>
  );
}

function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center md:hidden">
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        className="w-full max-w-3xl object-contain"
      />
    </div>
  );
}

function DesktopVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);
  return (
    <div className="hidden md:block w-full md:-mt-20">
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        className="w-full h-auto object-contain"
      />
    </div>
  );
}

function Hero({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white md:min-h-0">
      <VideoBackground />
      <Nav onOpen={onOpen} />
      <section
        className="relative z-10 flex flex-col items-start justify-start px-6 py-12 text-left sm:py-16 md:items-center md:text-center md:py-20"
      >
        <span className="animate-fade-rise inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur md:self-center">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ background: "var(--azure)" }}
            />
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--azure)" }}
            />
          </span>
          Now live in Jaipur
        </span>
        <h1
          className="animate-fade-rise mt-5 text-black text-balance text-[clamp(3rem,10vw,7rem)] md:mt-3 md:text-[clamp(2rem,4vw,3.5rem)] md:max-w-5xl md:mx-auto"
          style={{
            fontFamily: '"Poppins", ui-sans-serif, system-ui, sans-serif',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            maxWidth: "80rem",
          }}
        >
          Discover{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-warm)" }}
          >
            What's Happening
          </span>{" "}
          Around You
        </h1>
        <p
          className="animate-fade-rise-delay mt-8 max-w-4xl text-base leading-relaxed sm:text-lg line-clamp-2 md:mx-auto md:max-w-2xl md:mt-3"
          style={{ color: "#6F6F6F" }}
        >
          Find events, communities, trips, volunteering opportunities and like-minded people in Jaipur — all in one place.
        </p>
        <button
          onClick={onOpen}
          className="animate-fade-rise-delay-2 mt-6 rounded-full bg-black px-9 py-3 text-sm text-white transition-transform hover:scale-[1.03] md:self-center md:mt-3 md:py-3"
        >
          Log in to explore
        </button>
      </section>
      <DesktopVideo />
    </div>
  );
}

function WaitlistDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function reset() {
    setStep(1);
    setName("");
    setMobile("");
    setCity("");
    setInterests([]);
    setLoading(false);
  }

  function handleOpenChange(v: boolean) {
    onOpenChange(v);
    if (!v) setTimeout(reset, 200);
  }

  function next() {
    const parsed = step1Schema.safeParse({ name, mobile, city });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setStep(2);
  }

  function toggleInterest(opt: string) {
    setInterests((prev) =>
      prev.includes(opt) ? prev.filter((i) => i !== opt) : [...prev, opt],
    );
  }

  async function submit() {
    if (interests.length === 0) {
      toast.error("Pick at least one thing you're looking for");
      return;
    }
    setLoading(true);
    const payload = {
      name: name.trim(),
      mobile: mobile.trim(),
      city: city.trim(),
      interest: interests.join(", "),
    };
    const { error } = await supabase.from("waitlist_signups").insert(payload);
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    // Fire-and-forget mirror to Google Sheet, never block the user.
    appendSignupToSheet({ data: payload }).catch((e) =>
      console.error("Sheet append failed:", e),
    );
    setStep(3);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="orb-dialog w-[calc(100vw-2rem)] max-w-[340px] rounded-[18px] border-0 p-0 shadow-none overflow-visible bg-transparent sm:max-w-[380px] [&>button]:hidden">
        <DialogTitle className="sr-only">Log in to Orbies</DialogTitle>
        <DialogDescription className="sr-only">
          Sign up to discover events, communities and people near you.
        </DialogDescription>
        <div className="orb-swing">
        <div aria-hidden className="orb-rope" />
        <svg aria-hidden className="orb-knot" viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ropeStrandV" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#3a2410" />
              <stop offset="0.22" stopColor="#7a4f24" />
              <stop offset="0.5" stopColor="#e7c089" />
              <stop offset="0.78" stopColor="#7a4f24" />
              <stop offset="1" stopColor="#3a2410" />
            </linearGradient>
            <pattern id="strandTwist" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
              <rect width="7" height="7" fill="url(#ropeStrandV)" />
              <path d="M0 3.5 H7" stroke="#2a1808" strokeWidth="0.9" opacity="0.55" />
              <path d="M0 1.2 H7" stroke="#fff1d6" strokeWidth="0.5" opacity="0.35" />
            </pattern>
            <radialGradient id="bulgeShade" cx="0.4" cy="0.35" r="0.7">
              <stop offset="0" stopColor="rgba(255,235,200,0.45)" />
              <stop offset="0.6" stopColor="rgba(0,0,0,0)" />
              <stop offset="1" stopColor="rgba(0,0,0,0.45)" />
            </radialGradient>
          </defs>
          {/* soft cast shadow on card */}
          <ellipse cx="50" cy="62" rx="30" ry="3.5" fill="rgba(0,0,0,0.28)" />
          {/* symmetric back loops emerging from behind the central knot */}
          <path d="M50 4 C 22 8, 10 30, 26 48 C 34 56, 46 52, 50 42"
            stroke="url(#strandTwist)" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M50 4 C 78 8, 90 30, 74 48 C 66 56, 54 52, 50 42"
            stroke="url(#strandTwist)" strokeWidth="12" fill="none" strokeLinecap="round" />
          {/* dark cinch where rope enters the knot */}
          <ellipse cx="50" cy="10" rx="9" ry="3" fill="rgba(0,0,0,0.45)" />
          {/* central knot bulge (front) */}
          <ellipse cx="50" cy="34" rx="18" ry="13" fill="url(#strandTwist)" />
          <ellipse cx="50" cy="34" rx="18" ry="13" fill="url(#bulgeShade)" />
          <ellipse cx="50" cy="34" rx="18" ry="13" fill="none" stroke="#2a1808" strokeWidth="0.8" opacity="0.55" />
          {/* tight horizontal wrap lines across central knot */}
          <g stroke="#2a1808" strokeWidth="1" opacity="0.6" fill="none" strokeLinecap="round">
            <path d="M34 28 Q50 25.5 66 28" />
            <path d="M33 32 Q50 29.5 67 32" />
            <path d="M33 36 Q50 33.5 67 36" />
            <path d="M34 40 Q50 37.5 66 40" />
          </g>
          <g stroke="#fff1d6" strokeWidth="0.55" opacity="0.45" fill="none" strokeLinecap="round">
            <path d="M34 30 Q50 27.5 66 30" />
            <path d="M34 34 Q50 31.5 66 34" />
            <path d="M34 38 Q50 35.5 66 38" />
          </g>
          {/* small tail tuft below knot */}
          <path d="M46 46 Q50 52 54 46" stroke="url(#strandTwist)" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
        <div className="relative overflow-visible rounded-[18px] bg-white/95 p-5 text-foreground shadow-xl">
          <button
            type="button"
            aria-label="Close"
            onClick={() => handleOpenChange(false)}
            className="absolute right-3 top-3 z-30 grid h-8 w-8 place-items-center rounded-full bg-black/5 text-foreground/70 transition hover:bg-black/10 hover:text-foreground"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
          {step === 1 && (
            <>
              <div className="space-y-1.5">
                <h2 className="font-display text-2xl font-semibold leading-none tracking-tight">Log in to Orbies</h2>
                <p className="text-sm text-muted-foreground">
                  Quick login so we can show you what's happening near you tonight.
                </p>
              </div>
              <div className="mt-2 space-y-4">
                <Field label="Name">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                    maxLength={100}
                    className="orb-input"
                    autoFocus
                  />
                </Field>
                <Field label="Mobile number">
                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98xxxxxx00"
                    maxLength={20}
                    inputMode="tel"
                    className="orb-input"
                  />
                </Field>
                <Field label="City">
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Jaipur"
                    maxLength={100}
                    className="orb-input"
                  />
                </Field>
              </div>
              <button
                onClick={next}
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
                style={{
                  background: "var(--gradient-warm)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                Next
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-1.5">
                <h2 className="font-display text-2xl font-semibold leading-none tracking-tight">
                  What do you want to see first?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Pick one — we'll open your feed with this on top.
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {INTERESTS.map((opt) => {
                  const active = interest === opt;
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setInterest(opt)}
                      className={
                        "rounded-full border px-3.5 py-1.5 text-sm transition " +
                        (active
                          ? "border-transparent text-primary-foreground"
                          : "border-border bg-background text-foreground/80 hover:border-foreground/30")
                      }
                      style={active ? { background: "var(--gradient-warm)" } : undefined}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground/80 transition hover:border-foreground/40"
                >
                  Back
                </button>
                <button
                  onClick={submit}
                  disabled={loading}
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105 disabled:opacity-70"
                  style={{
                    background: "var(--gradient-warm)",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  {loading ? "Logging in…" : "Take me in"}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="py-4 text-center">
              <div
                className="mx-auto grid h-14 w-14 place-items-center rounded-full text-primary-foreground"
                style={{ background: "var(--gradient-warm)" }}
              >
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold">
                You're in, {name.split(" ")[0] || "friend"} 🎉
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We're loading {interest ? interest.toLowerCase() : "things"} happening
                around {city || "you"} right now. Your feed will be ready in a few
                moments — we'll text you on {mobile ? mobile : "your number"} the
                second it's live.
              </p>
              <button
                onClick={() => handleOpenChange(false)}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
                style={{
                  background: "var(--gradient-warm)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                Got it
              </button>
            </div>
          )}

          <style>{`
            .orb-input {
              width: 100%;
              border-radius: 0.75rem;
              background: var(--background);
              border: 1px solid var(--input);
              padding: 0.75rem 0.9rem;
              font-size: 0.95rem;
              color: var(--foreground);
              outline: none;
              transition: border-color .15s, box-shadow .15s;
            }
            .orb-input:focus {
              border-color: var(--ring);
              box-shadow: 0 0 0 4px oklch(0.68 0.21 30 / 0.15);
            }
            .orb-input::placeholder { color: oklch(0.55 0.03 50 / 0.7); }
            @keyframes orb-drop {
              0%   { transform: translateY(-130vh) rotate(0deg); }
              50%  { transform: translateY(2vh)   rotate(-2.2deg); }
              68%  { transform: translateY(-1vh)  rotate(1.6deg); }
              82%  { transform: translateY(0.4vh) rotate(-0.9deg); }
              92%  { transform: translateY(0)     rotate(0.4deg); }
              100% { transform: translateY(0)     rotate(0deg); }
            }
            @keyframes orb-sway {
              0%, 100% { transform: rotate(-0.8deg); }
              50%      { transform: rotate(0.8deg); }
            }
            /* Rope grows in, then gently stretches/contracts with the swing for a gravity feel */
            @keyframes orb-rope-grow {
              0%   { height: 0;    opacity: 0; transform: translateX(-50%) scaleY(0.6); }
              40%  {              opacity: 1; }
              100% { height: 50vh; opacity: 1; transform: translateX(-50%) scaleY(1); }
            }
            @keyframes orb-rope-stretch {
              0%, 100% { transform: translateX(-50%) scaleY(1); }
              25%      { transform: translateX(-50%) scaleY(1.012); }
              50%      { transform: translateX(-50%) scaleY(0.994); }
              75%      { transform: translateX(-50%) scaleY(1.012); }
            }
            .orb-dialog { overflow: visible !important; }
            .orb-swing {
              /* Pivot from the ceiling (top of rope) so rope + card swing together */
              transform-origin: 50% -50vh;
              animation:
                orb-drop 1.5s cubic-bezier(0.22, 1, 0.36, 1) both,
                orb-sway 4.8s cubic-bezier(0.45, 0, 0.55, 1) 1.5s infinite;
              will-change: transform;
              position: relative;
            }
            .orb-rope {
              position: absolute;
              left: 50%;
              bottom: 100%;
              width: 16px;
              transform: translateX(-50%);
              transform-origin: top center;
              border-radius: 8px;
              animation:
                orb-rope-grow 0.6s ease-out both,
                orb-rope-stretch 4.8s cubic-bezier(0.45, 0, 0.55, 1) 1.5s infinite;
              z-index: 1;
              /* Tiled SVG: jute-colored 3-strand twist segment, repeated vertically */
              background-color: #8b5a2b;
              background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='14' viewBox='0 0 16 14'>\
<defs>\
<linearGradient id='g' x1='0' y1='0' x2='1' y2='0'>\
<stop offset='0' stop-color='%23492a10'/>\
<stop offset='0.2' stop-color='%23805227'/>\
<stop offset='0.5' stop-color='%23e7c089'/>\
<stop offset='0.8' stop-color='%23805227'/>\
<stop offset='1' stop-color='%23492a10'/>\
</linearGradient>\
</defs>\
<rect width='16' height='14' fill='url(%23g)'/>\
<g stroke='%23341d08' stroke-width='1.3' fill='none' opacity='0.55' stroke-linecap='round'>\
<path d='M-3 5 Q4 1 9 -1 T20 -6'/>\
<path d='M-3 12 Q4 8 9 6 T20 1'/>\
<path d='M-3 19 Q4 15 9 13 T20 8'/>\
</g>\
<g stroke='%23fff1d6' stroke-width='0.7' fill='none' opacity='0.4' stroke-linecap='round'>\
<path d='M-3 3 Q4 -1 9 -3 T20 -8'/>\
<path d='M-3 10 Q4 6 9 4 T20 -1'/>\
<path d='M-3 17 Q4 13 9 11 T20 6'/>\
</g>\
<g stroke='%23341d08' stroke-width='0.4' fill='none' opacity='0.5'>\
<path d='M2 -1 L0 4 M5 1 L3 6 M8 3 L6 8 M11 5 L9 10 M14 7 L12 12'/>\
</g>\
</svg>");
              background-repeat: repeat-y;
              background-size: 16px 14px;
              box-shadow:
                inset 2px 0 2px rgba(0,0,0,0.45),
                inset -2px 0 2px rgba(0,0,0,0.45),
                inset 0 0 1px rgba(0,0,0,0.3),
                0 0 1px rgba(0,0,0,0.3);
            }
            .orb-rope::before {
              /* fade rope into the ceiling */
              content: "";
              position: absolute;
              top: 0; left: 50%;
              width: 100%; height: 24px;
              transform: translateX(-50%);
              background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0) 100%);
              pointer-events: none;
            }
            /* SVG knot resting on top of the card (sitting above its top edge) */
            .orb-knot {
              position: absolute;
              left: 50%;
              bottom: 100%;
              margin-bottom: -14px;
              width: 64px;
              height: 45px;
              transform: translateX(-50%);
              z-index: 3;
              filter: drop-shadow(0 4px 3px rgba(0,0,0,0.35));
              pointer-events: none;
              animation: orb-rope-grow 0.6s ease-out both;
            }
          `}</style>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Categories() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 lg:py-20">
      <div className="max-w-2xl">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          One place
        </span>
        <h2 className="mt-3 font-display text-[30px] font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
          Everything happening in your city.
        </h2>
        <p className="mt-3 text-[15px] text-muted-foreground sm:text-lg">
          Stop scrolling through ten WhatsApp groups, three Instagram pages and
          a Telegram channel. Orbies brings the whole city into one feed.
        </p>
      </div>

      <div className="mt-9 sm:mt-12">
        <ScrollStack
          useWindowScroll
          itemDistance={60}
          itemStackDistance={24}
          baseScale={0.88}
          stackPosition="22%"
          scaleEndPosition="12%"
        >
          {CATEGORIES.map(({ icon: Icon, title, tagline, desc, bg, fg }, i) => (
            <ScrollStackItem
              key={title}
              itemClassName="overflow-hidden border-0"
            >
              <div
                className="absolute inset-0"
                style={{ background: bg }}
                aria-hidden
              />
              <div
                className="relative flex h-full flex-col justify-between"
                style={{ color: fg }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[0.25em] opacity-80"
                  >
                    0{i + 1} — {title}
                  </span>
                  <Icon className="h-6 w-6 opacity-90" />
                </div>

                <div>
                  <h3 className="font-display text-[40px] font-black uppercase leading-[0.95] tracking-[-0.03em] sm:text-6xl">
                    {title}
                  </h3>
                  <p className="mt-4 max-w-xl font-display text-[18px] font-bold leading-tight tracking-[-0.01em] sm:text-2xl">
                    {tagline}
                  </p>
                </div>

                <p className="text-[13px] leading-relaxed opacity-80 sm:text-sm">
                  {desc}
                </p>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}

function Why() {
  const items = [
    {
      k: "Fragmented today",
      v: "WhatsApp, Instagram, Telegram, word-of-mouth — none of it talks to each other.",
    },
    {
      k: "You miss out",
      v: "Events go unnoticed. Communities stay hidden. Trips happen without you.",
    },
    {
      k: "Orbies fixes it",
      v: "A single, beautiful place to discover and join everything around you.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 lg:py-20">
      <div
        className="rounded-3xl border border-border p-6 sm:p-12"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.99 0.005 250) 0%, oklch(0.96 0.02 250) 100%)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <h2 className="max-w-2xl font-display text-[26px] font-bold tracking-[-0.03em] sm:text-4xl">
          The city is alive — you just can't see it yet.
        </h2>
        <div className="mt-7 grid gap-6 sm:mt-10 sm:grid-cols-3 sm:gap-8">
          {items.map((it) => (
            <div key={it.k}>
              <div className="font-display text-[12px] font-semibold uppercase tracking-wider text-primary">
                {it.k}
              </div>
              <p className="mt-2 text-[14px] text-foreground/80 sm:text-base">{it.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-6xl border-t border-border px-5 py-7">
      <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-muted-foreground sm:text-sm">
        <span>© {new Date().getFullYear()} Orbies</span>
        <span>Made with care in Jaipur.</span>
      </div>
    </footer>
  );
}
