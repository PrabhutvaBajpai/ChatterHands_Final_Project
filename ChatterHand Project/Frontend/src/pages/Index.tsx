import { Link } from "react-router-dom";
import { Hand, BookOpen, Target, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-animated-gradient">
      <div className="grain absolute inset-0" />

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* Hero */}
        <section className="text-center animate-fade-in">
          <div className="mx-auto mb-8 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary-glow shadow-[var(--shadow-glow-primary)] animate-float">
            <Hand className="h-12 w-12 text-primary-foreground" strokeWidth={2} />
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Inclusive learning, made joyful
          </div>

          <h1 className="font-display text-5xl font-extrabold tracking-tight md:text-7xl">
            Chatter<span className="text-gradient-primary">Hands</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Learn and master American Sign Language, one letter at a time.
          </p>
        </section>

        {/* Cards */}
        <section className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8">
          {/* LEARN */}
          <Link
            to="/learn"
            className="group relative overflow-hidden rounded-3xl border border-border card-gradient p-8 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/60 hover:shadow-[var(--shadow-lift)] animate-slide-up"
          >
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
            <div className="relative">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
                <BookOpen className="h-8 w-8" />
              </div>
              <h2 className="font-display text-3xl font-bold">Learn</h2>
              <p className="mt-3 text-muted-foreground">
                Watch videos and learn all 26 ASL alphabet signs at your own pace.
              </p>
              <Button variant="hero" size="lg" className="mt-8 w-full sm:w-auto">
                Start Learning <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </Link>

          {/* TEST */}
          <Link
            to="/test"
            className="group relative overflow-hidden rounded-3xl border border-border card-gradient p-8 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-2 hover:border-secondary/60 hover:shadow-[0_30px_60px_-25px_hsl(var(--secondary)/0.5)] animate-slide-up [animation-delay:120ms]"
          >
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-secondary/25 blur-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/15 text-secondary-glow ring-1 ring-secondary/30">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="font-display text-3xl font-bold">Test Yourself</h2>
              <p className="mt-3 text-muted-foreground">
                Put your skills to the test! Sign 10 random letters in front of your webcam and get instant feedback.
              </p>
              <Button variant="purple" size="lg" className="mt-8 w-full sm:w-auto">
                Take the Test <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </Link>
        </section>

        <footer className="mt-20 text-center text-sm text-muted-foreground">
          Built with care for accessibility · ChatterHands © 2026
        </footer>
      </div>
    </main>
  );
};

export default Index;
