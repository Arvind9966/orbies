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
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

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

const signupSchema = z.object({
  name: z.string().trim().min(1, "Tell us your name").max(100),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid mobile number"),
  interest: z.enum(INTERESTS, { message: "Pick what you're looking for" }),
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
  return (
    <div className="min-h-screen">
      <Toaster richColors position="top-center" />
      <Nav />
      <Hero />
      <Categories />
      <Why />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <a href="#" className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full text-primary-foreground"
              style={{ background: "var(--gradient-warm)" }}>
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

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-12">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--coral)" }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--coral)" }} />
          </span>
          Now live in Jaipur
        </span>
        <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Discover what's{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-warm)" }}
          >
            happening around you
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Find communities, events, trips, volunteering opportunities and
          like-minded people — all in one place. No more digging through ten
          WhatsApp groups.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <Stat label="Events" />
          <Dot />
          <Stat label="Communities" />
          <Dot />
          <Stat label="Trips" />
          <Dot />
          <Stat label="Volunteering" />
        </div>
      </div>

      <WaitlistCard />
    </section>
  );
}

function Stat({ label }: { label: string }) {
  return <span className="font-medium text-foreground/80">{label}</span>;
}
function Dot() {
  return <span className="h-1 w-1 rounded-full bg-foreground/30" />;
}

function WaitlistCard() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [interest, setInterest] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = signupSchema.safeParse({ name, mobile, interest });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("waitlist_signups").insert(parsed.data);
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setDone(true);
    toast.success("You will be informed soon.");
  }

  if (done) {
    return (
      <div
        className="relative rounded-3xl border border-border bg-card p-8 text-center"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div
          className="mx-auto grid h-14 w-14 place-items-center rounded-full text-primary-foreground"
          style={{ background: "var(--gradient-warm)" }}
        >
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold">You will be informed soon.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We are matching {interest ? interest.toLowerCase() : "things"} near you in Jaipur. You will hear from us the moment something relevant pops up.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative rounded-3xl border border-border bg-card p-6 sm:p-8"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-70 blur-2xl"
        style={{ background: "var(--gradient-warm)" }}
      />
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        Discover around you
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tell us what you are into and we will ping you when it pops up nearby.
      </p>

      <div className="mt-6 space-y-4">
        <Field label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aarav Sharma"
            maxLength={100}
            className="input"
          />
        </Field>
        <Field label="Mobile number">
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="+91 98xxxxxx00"
            maxLength={20}
            inputMode="tel"
            className="input"
          />
        </Field>
        <div>
          <label className="text-sm font-medium text-foreground">
            What are you looking for on Orbies?
          </label>
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
                  style={
                    active
                      ? { background: "var(--gradient-warm)" }
                      : undefined
                  }
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-105 disabled:opacity-70"
        style={{
          background: "var(--gradient-warm)",
          boxShadow: "var(--shadow-glow)",
        }}
      >
        {loading ? "Joining…" : "Join the waitlist"}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        No spam. We'll only message you when Orbies is ready.
      </p>

      <style>{`
        .input {
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
        .input:focus {
          border-color: var(--ring);
          box-shadow: 0 0 0 4px oklch(0.68 0.21 30 / 0.15);
        }
        .input::placeholder { color: oklch(0.55 0.03 50 / 0.7); }
      `}</style>
    </form>
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
