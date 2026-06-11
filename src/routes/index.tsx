import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
      <Nav />
      <Hero onOpen={() => setOpen(true)} />
      <Categories />
      <Why />
      <Footer />
      <WaitlistDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function Nav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <a href="#" className="flex items-center gap-2">
        <span
          className="grid h-9 w-9 place-items-center rounded-full text-primary-foreground"
          style={{ background: "var(--gradient-warm)" }}
        >
          <span className="font-display text-lg font-bold">O</span>
        </span>
        <span className="font-display text-xl font-semibold tracking-tight">Orbies</span>
      </a>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        <span>Starting in Jaipur</span>
      </div>
    </header>
  );
}

function Hero({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-16 pt-10 text-center lg:pb-24 lg:pt-16">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ background: "var(--coral)" }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--coral)" }}
          />
        </span>
        Now live in Jaipur
      </span>
      <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
        See what's{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "var(--gradient-warm)" }}
        >
          happening in Jaipur tonight
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
        2,400+ people are already on Orbies right now — discovering events,
        trips, communities and meetups around them. Log in to see what's
        happening near you.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          onClick={onOpen}
          className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold text-primary-foreground transition hover:brightness-105"
          style={{
            background: "var(--gradient-warm)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          Log in to explore
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>
        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          128 people logged in over the last hour
        </p>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
        <Stat label="Events" />
        <Dot />
        <Stat label="Communities" />
        <Dot />
        <Stat label="Trips" />
        <Dot />
        <Stat label="Volunteering" />
      </div>
    </section>
  );
}

function Stat({ label }: { label: string }) {
  return <span className="font-medium text-foreground/80">{label}</span>;
}
function Dot() {
  return <span className="h-1 w-1 rounded-full bg-foreground/30" />;
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
    <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          One place
        </span>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Everything happening in your city.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Stop scrolling through ten WhatsApp groups, three Instagram pages and
          a Telegram channel. Orbies brings the whole city into one feed.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map(({ icon: Icon, title, desc }, i) => (
          <article
            key={title}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition hover:-translate-y-1"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div
              aria-hidden
              className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition group-hover:opacity-60"
              style={{ background: "var(--gradient-warm)" }}
            />
            <div
              className="relative grid h-12 w-12 place-items-center rounded-2xl text-primary-foreground"
              style={{ background: "var(--gradient-warm)" }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="relative mt-5 font-display text-2xl font-semibold tracking-tight">
              {title}
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
              {desc}
            </p>
            <span className="relative mt-6 inline-block text-xs font-medium text-foreground/50">
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
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div
        className="rounded-3xl border border-border p-8 sm:p-12"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.02 75) 0%, oklch(0.94 0.04 65) 100%)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          The city is alive — you just can't see it yet.
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {items.map((it) => (
            <div key={it.k}>
              <div className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
                {it.k}
              </div>
              <p className="mt-2 text-foreground/80">{it.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-6xl border-t border-border px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Orbies</span>
        <span>Made with care in Jaipur.</span>
      </div>
    </footer>
  );
}
