import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ";

const Learn = () => {
  const [openLetter, setOpenLetter] = useState<string | null>(null);

  return (
    <main className="relative min-h-screen overflow-hidden bg-animated-gradient">
      <div className="grain absolute inset-0" />
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-10 md:py-14">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <header className="mt-8 animate-fade-in">
          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            Learn <span className="text-gradient-primary">ASL Alphabet</span>
          </h1>
          <p className="mt-3 text-muted-foreground md:text-lg">
            Watch videos to learn each letter in American Sign Language.
          </p>
        </header>

        <section className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {LETTERS.map((letter, i) => (
            <article
              key={letter}
              className="group rounded-2xl border border-border card-gradient p-4 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 animate-scale-in"
              style={{ animationDelay: `${i * 25}ms` }}
            >
              <div className="font-display text-center text-4xl font-extrabold text-foreground">
                {letter}
              </div>
              <button
                onClick={() => setOpenLetter(letter)}
                className="relative mt-3 flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-muted/60 ring-1 ring-border transition-all group-hover:ring-primary/40"
                aria-label={`Play video for letter ${letter}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow-primary)] transition-transform group-hover:scale-110">
                  <Play className="h-5 w-5 fill-current" />
                </div>
              </button>
              <Button
                variant="hero"
                size="sm"
                className="mt-3 w-full"
                onClick={() => setOpenLetter(letter)}
              >
                Watch
              </Button>
            </article>
          ))}
        </section>
      </div>

      <Dialog open={!!openLetter} onOpenChange={(o) => !o && setOpenLetter(null)}>
        <DialogContent className="max-w-3xl border-border bg-card p-0 sm:rounded-2xl">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="font-display text-xl font-bold">
              Letter <span className="text-primary">{openLetter}</span>
            </h3>
            <button
              onClick={() => setOpenLetter(null)}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="aspect-video w-full overflow-hidden rounded-b-2xl bg-black">
            {openLetter && (
              <iframe
                src={VIDEO_URL}
                title={`ASL letter ${openLetter}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Learn;
