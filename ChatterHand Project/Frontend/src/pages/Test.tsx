import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const BACKEND_WS_URL = import.meta.env.VITE_BACKEND_WS_URL ?? "ws://localhost:8000/ws";
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
  const [prediction, setPrediction] = useState<string | null>(null);
  const [handDetected, setHandDetected] = useState(false);
  const [connected, setConnected] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const captureTimerRef = useRef<number | null>(null);

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject instanceof MediaStream) {
      video.srcObject.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  const stopWebSocket = () => {
    if (captureTimerRef.current) {
      window.clearInterval(captureTimerRef.current);
      captureTimerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
  };

  const score = results.filter((r) => r.correct).length;
  const isLast = index === letters.length - 1;
  const current = letters[index];

  useEffect(() => {
    setStatus("waiting");
    setPrediction(null);
    setHandDetected(false);
  }, [index]);

  useEffect(() => {
    if (!cameraActive) {
      stopCamera();
      setConnected(false);
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage("Unable to access webcam. Please allow camera access.");
        setCameraActive(false);
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, [cameraActive]);

  useEffect(() => {
    if (!cameraActive) {
      return;
    }

    const socket = new WebSocket(BACKEND_WS_URL);

    socket.onopen = () => {
      setConnected(true);
      setErrorMessage(null);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setPrediction(data.prediction ?? null);
        setHandDetected(Boolean(data.hand_detected));
      } catch (error) {
        console.error("Invalid WebSocket response", error);
      }
    };

    socket.onclose = () => {
      setConnected(false);
    };

    socket.onerror = () => {
      setErrorMessage("Unable to connect to the backend. Check that the FastAPI server is running on port 8000.");
      setConnected(false);
    };

    wsRef.current = socket;

    return () => {
      stopWebSocket();
    };
  }, [cameraActive]);

  useEffect(() => {
    return () => {
      stopCamera();
      stopWebSocket();
    };
  }, []);

  useEffect(() => {
    if (!connected || status !== "waiting") {
      return;
    }

    const captureFrame = () => {
      const video = videoRef.current;
      const socket = wsRef.current;

      if (!video || !socket || socket.readyState !== WebSocket.OPEN) {
        return;
      }

      const width = video.videoWidth;
      const height = video.videoHeight;
      if (!width || !height) {
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      socket.send(dataUrl);
    };

    captureTimerRef.current = window.setInterval(captureFrame, 700);
    return () => {
      if (captureTimerRef.current) {
        window.clearInterval(captureTimerRef.current);
      }
    };
  }, [connected, status]);

  const submitPrediction = () => {
    if (status !== "waiting") {
      return;
    }

    const correct = prediction === current && handDetected;
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
                  <span className={`h-2 w-2 rounded-full ${connected ? "bg-success" : "bg-destructive"}`} />
                  {connected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-muted/40 ring-1 ring-border">
                <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-muted/70 p-4 text-sm text-muted-foreground">
              <div className="mb-2 flex items-center justify-between">
                <span>Webcam</span>
                <span>{cameraActive ? "enabled" : "disabled"}</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span>Backend status</span>
                <span>{connected ? "online" : "offline"}</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span>Detected sign</span>
                <span>{prediction ?? "Waiting..."}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Hand detected</span>
                <span>{handDetected ? "Yes" : "No"}</span>
              </div>
              {errorMessage && <p className="mt-3 text-xs text-destructive-foreground">{errorMessage}</p>}
            </div>

            <div className="mt-6 grid gap-3">
              <Button
                variant="outline"
                onClick={() => setCameraActive((active) => !active)}
                className="w-full border-primary/50 text-foreground hover:bg-primary/10 hover:text-foreground"
              >
                {cameraActive ? "Stop Webcam" : "Start Webcam"}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={submitPrediction}
                  disabled={status !== "waiting" || !connected || !cameraActive}
                  className="border-primary/50 text-foreground hover:bg-primary/10 hover:text-foreground"
                >
                  <Check className="mr-1 h-4 w-4" /> Check Sign
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPrediction(null);
                    setHandDetected(false);
                    setErrorMessage(null);
                  }}
                  className="border-secondary/50 text-secondary hover:bg-secondary/10 hover:text-secondary"
                >
                  <X className="mr-1 h-4 w-4" /> Reset View
                </Button>
              </div>
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
