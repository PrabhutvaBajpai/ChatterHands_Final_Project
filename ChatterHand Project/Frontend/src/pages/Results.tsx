import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TestResult } from "./Test";

type State = { results: TestResult[]; letters: string[] } | null;

function getMessage(score: number) {
  if (score >= 9) return { emoji: "🌟", title: "Outstanding! You're an ASL Pro!" };
  if (score >= 7) return { emoji: "💪", title: "Great Job! Keep it up!" };
  if (score >= 5) return { emoji: "📚", title: "Good Effort! A little more practice!" };
  return { emoji: "🌱", title: "Don't give up! Every expert was a beginner!" };
}

const Results = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: State };

  if (!state?.results?.length) return <Navigate to="/" replace />;

  const { results } = state;
  const score = results.filter((r) => r.correct).length;
  const total = results.length;
  const { emoji, title } = getMessage(score);
  const pct = (score / total) * 100;

  return (
    <main className="relative min-h-screen overflow-hidden bg-animated-gradient">
      <div className="grain absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-6 py-12 md:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <section className="mt-10 text-center animate-fade-in">
          <div className="text-7xl animate-float md:text-8xl">{emoji}</div>
          <h1 className="mt-4 font-display text-3xl font-extrabold md:text-4xl">{title}</h1>
        </section>

        {/* Circular score */}
        <section className="mt-10 flex justify-center animate-pop-in">
          <div className="relative h-48 w-48">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="44" fill="none"
                stroke="url(#grad)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 276.46} 276.46`}
                style={{ transition: "stroke-dasharray 1s ease-out" }}
              />
              <defs>
                <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-display text-5xl font-extrabold text-foreground">{score}</p>
              <p className="text-sm text-muted-foreground">out of {total}</p>
            </div>
          </div>
        </section>

        {/* Breakdown */}
        <section className="mt-12 rounded-2xl border border-border card-gradient p-2 shadow-[var(--shadow-card)]">
          <h2 className="px-4 pt-3 pb-2 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Breakdown
          </h2>
          <ul className="divide-y divide-border">
            {results.map((r, i) => (
              <li
                key={i}
                className="flex items-center justify-between px-4 py-3 animate-fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted font-display font-bold">
                    {r.letter}
                  </span>
                  <span className="text-sm text-muted-foreground">Letter {i + 1}</span>
                </div>
                {r.correct ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                    <Check className="h-3.5 w-3.5" /> Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1 text-xs font-semibold text-destructive">
                    <X className="h-3.5 w-3.5" /> Wrong
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button variant="hero" size="lg" onClick={() => navigate("/test")}>
            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </section>
      </div>
    </main>
  );
};

export default Results;
