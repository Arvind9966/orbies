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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
    desc: "Startup meetups, open mics, workshops, networking nights.",
  },
  {
    icon: Users,
    title: "Communities",
    desc: "Reading clubs, fitness crews, photography circles, founder groups.",
  },
  {
    icon: Mountain,
    title: "Trips",
    desc: "Weekend treks, group travel, bike rides and adventures.",
  },
  {
    icon: HeartHandshake,
    title: "Volunteering",
    desc: "NGO drives, blood donations, environmental causes.",
  },
  {
    icon: Sparkles,
    title: "People",
    desc: "Founders, creators, students and professionals near you.",
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
      <a href="#" className="font-serif-display text-2xl tracking-tight text-black sm:text-3xl">
        Orbies
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
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center">
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

function Hero({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <VideoBackground />
      <Nav onOpen={onOpen} />
      <section
        className="relative z-10 flex flex-col items-start justify-start px-6 pb-16 pt-6 text-left sm:pt-10"
      >
        <span className="animate-fade-rise inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
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
          className="animate-fade-rise mt-5 text-black text-balance"
          style={{
            fontFamily: '"Poppins", ui-sans-serif, system-ui, sans-serif',
            fontWeight: 900,
            fontSize: "clamp(3rem, 10vw, 7rem)",
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
          className="animate-fade-rise-delay mt-8 max-w-4xl text-base leading-relaxed sm:text-lg line-clamp-2"
          style={{ color: "#6F6F6F" }}
        >
          Find events, communities, trips, volunteering opportunities and like-minded people in Jaipur — all in one place.
        </p>
        <button
          onClick={onOpen}
          className="animate-fade-rise-delay-2 mt-12 rounded-full bg-black px-14 py-5 text-base text-white transition-transform hover:scale-[1.03]"
        >
          Log in to explore
        </button>
      </section>
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
  const [interest, setInterest] = useState<string>("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setStep(1);
    setName("");
    setMobile("");
    setCity("");
    setInterest("");
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

  async function submit() {
    if (!interest) {
      toast.error("Pick what you're looking for");
      return;
    }
    setLoading(true);
    const payload = {
      name: name.trim(),
      mobile: mobile.trim(),
      city: city.trim(),
      interest,
    };
    const { error } = await supabase.from("waitlist_signups").insert(payload);
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    // Fire-and-forget mirror to Google Sheet — never block the user.
    appendSignupToSheet({ data: payload }).catch((e) =>
      console.error("Sheet append failed:", e),
    );
    setStep(3);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Log in to Orbies</DialogTitle>
              <DialogDescription>
                Quick login so we can show you what's happening near you tonight.
              </DialogDescription>
            </DialogHeader>
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
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                What do you want to see first?
              </DialogTitle>
              <DialogDescription>
                Pick one — we'll open your feed with this on top.
              </DialogDescription>
            </DialogHeader>
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
        `}</style>
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
    <section className="mx-auto max-w-6xl px-5 py-14 lg:py-24">
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

      <div className="mt-9 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {CATEGORIES.map(({ icon: Icon, title, desc }, i) => (
          <article
            key={title}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card/90 p-5 backdrop-blur transition active:scale-[0.99] hover:-translate-y-1 sm:p-7"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div
              aria-hidden
              className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition group-hover:opacity-60"
              style={{ background: "var(--gradient-warm)" }}
            />
            <div
              className="relative grid h-11 w-11 place-items-center rounded-2xl text-primary-foreground sm:h-12 sm:w-12"
              style={{ background: "var(--gradient-warm)" }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="relative mt-4 font-display text-[20px] font-semibold tracking-[-0.02em] sm:mt-5 sm:text-2xl">
              {title}
            </h3>
            <p className="relative mt-1.5 text-[14px] leading-relaxed text-muted-foreground sm:text-sm">
              {desc}
            </p>
            <span className="relative mt-5 inline-block text-[11px] font-medium text-foreground/40 sm:mt-6 sm:text-xs">
              0{i + 1}
            </span>
          </article>
        ))}
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
    <section className="mx-auto max-w-6xl px-5 pb-20">
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
