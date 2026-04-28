import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function pickRandom(n: number) {
  const pool = [...LETTERS];
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

type Status = "waiting" | "correct" | "wrong";
export type TestResult = { letter: string; correct: boolean };

const Test = () => {
  const navigate = useNavigate();
  const letters = useMemo(() => pickRandom(10), []);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("waiting");
  const [results, setResults] = useState<TestResult[]>([]);
  const score = results.filter((r) => r.correct).length;
  const isLast = index === letters.length - 1;
  const current = letters[index];

  useEffect(() => {
    setStatus("waiting");
  }, [index]);

  const simulate = (correct: boolean) => {
    if (status !== "waiting") return;
    setStatus(correct ? "correct" : "wrong");
    setResults((r) => [...r, { letter: current, correct }]);
  };

  const next = () => {
    if (status === "waiting") return;
    if (isLast) {
      navigate("/results", { state: { results: [...results], letters } });
    } else {
      setIndex((i) => i + 1);
    }
  };

  const progress = ((index + (status !== "waiting" ? 1 : 0)) / letters.length) * 100;

  return (
    <main className="relative min-h-screen overflow-hidden bg-animated-gradient">
      <div className="grain absolute inset-0" />
      <div className="pointer-events-none absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-40 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-14">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* LEFT: Prompt */}
          <section className="animate-slide-up">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Letter <span className="text-foreground">{index + 1}</span> of {letters.length}
              </p>
              <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="glow-border mt-8 flex aspect-square w-full flex-col items-center justify-center rounded-3xl card-gradient p-8 text-center">
              <div
                key={current}
                className="font-display text-[12rem] font-extrabold leading-none text-gradient-primary animate-pop-in md:text-[16rem]"
              >
                {current}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Show this sign to your webcam
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border card-gradient p-5 text-center">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="mt-1 font-display text-3xl font-bold">
                <span className="text-primary">{score}</span>
                <span className="text-muted-foreground"> / {letters.length}</span>
              </p>
            </div>
          </section>

          {/* RIGHT: Webcam */}
          <section className="animate-slide-up [animation-delay:100ms]">
            <div className="rounded-3xl border-2 border-primary/40 card-gradient p-4 shadow-[var(--shadow-glow-primary)]">
              <div className="mb-3 flex items-center justify-between px-2">
                <p className="text-sm font-semibold">Your Camera</p>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                  Live
                </span>
              </div>
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-muted/40 ring-1 ring-border">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                <div className="relative flex flex-col items-center text-muted-foreground">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Camera className="h-10 w-10" />
                  </div>
                  <p className="mt-3 font-medium text-foreground">Webcam Active</p>
                </div>
              </div>
            </div>

            {/* Status badge */}
            <div className="mt-6 flex justify-center">
              {status === "waiting" && (
                <div className="inline-flex items-center gap-2 rounded-full bg-muted px-5 py-2.5 text-sm font-medium text-muted-foreground">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                  Waiting for your sign...
                </div>
              )}
              {status === "correct" && (
                <div className="inline-flex animate-pop-in items-center gap-2 rounded-full bg-success px-5 py-2.5 text-sm font-semibold text-success-foreground shadow-[0_0_30px_hsl(var(--success)/0.5)]">
                  <Check className="h-4 w-4" /> Correct! +1 point
                </div>
              )}
              {status === "wrong" && (
                <div className="inline-flex animate-pop-in items-center gap-2 rounded-full bg-destructive px-5 py-2.5 text-sm font-semibold text-destructive-foreground shadow-[0_0_30px_hsl(var(--destructive)/0.5)]">
                  <X className="h-4 w-4" /> Incorrect! Try next one.
                </div>
              )}
            </div>

            {/* Simulation controls (placeholder for backend) */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => simulate(true)}
                disabled={status !== "waiting"}
                className="border-success/50 text-success hover:bg-success/10 hover:text-success"
              >
                <Check className="mr-1 h-4 w-4" /> Simulate Correct
              </Button>
              <Button
                variant="outline"
                onClick={() => simulate(false)}
                disabled={status !== "waiting"}
                className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="mr-1 h-4 w-4" /> Simulate Wrong
              </Button>
            </div>

            <Button
              variant="hero"
              size="lg"
              onClick={next}
              disabled={status === "waiting"}
              className="mt-4 w-full"
            >
              {isLast ? "See Results" : "Next Letter"} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Test;
