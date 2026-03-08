"use client";

import { useState, useTransition, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Image,
  Video,
  Coins,
  Send,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Trophy,
  Clock,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { submitTranscription } from "@/actions/transcription";

// ─── Types ─────────────────────────────────────────────────────────────

interface MediaTask {
  id: string;
  title: string;
  streamUrl: string;
  thumbnailUrl?: string | null;
  category: string | null;
  rewardCoins: number;
  mediaType: string;
}

interface ImageTask {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  category: string | null;
  rewardCoins: number;
}

interface Submission {
  id: string;
  title: string;
  rewardCoins: number;
  status: string;
  createdAt: string;
}

interface UnifiedTasksClientProps {
  videoTask: MediaTask | null;
  imageTasks: ImageTask[];
  todayCount: number;
  dailyLimit: number;
  limitReached: boolean;
  noVideoTasks: boolean;
  noImageTasks: boolean;
  submissions: Submission[];
}

type Category = "videos" | "images";

// ─── Fullscreen Video Modal ────────────────────────────────────────────

function VideoModal({
  task,
  onClose,
  onComplete,
}: {
  task: MediaTask;
  onClose: () => void;
  onComplete: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  function fmt(s: number) {
    return `${Math.floor(s / 60).toString().padStart(2, "0")}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onT = () => setElapsed(v.currentTime);
    const onD = () => setDuration(v.duration || 0);
    const onE = () => setIsPlaying(false);
    const onP = () => setIsPlaying(true);
    const onPa = () => setIsPlaying(false);
    v.addEventListener("timeupdate", onT);
    v.addEventListener("durationchange", onD);
    v.addEventListener("ended", onE);
    v.addEventListener("play", onP);
    v.addEventListener("pause", onPa);
    return () => {
      v.removeEventListener("timeupdate", onT);
      v.removeEventListener("durationchange", onD);
      v.removeEventListener("ended", onE);
      v.removeEventListener("play", onP);
      v.removeEventListener("pause", onPa);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  const rewind = useCallback(() => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.max(0, v.currentTime - 5);
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = val;
    setElapsed(val);
  }, []);

  const handleSubmit = () => {
    if (wordCount < 5) return;
    startTransition(async () => {
      const res = await submitTranscription(task.id, text);
      setResult(res);
      if (res.success) setTimeout(() => { onComplete(); onClose(); }, 1200);
    });
  };

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-zinc-900 rounded-t-2xl overflow-hidden">
          <video
            ref={videoRef}
            src={task.streamUrl}
            poster={task.thumbnailUrl ?? undefined}
            className="h-full w-full object-contain"
            preload="metadata"
            playsInline
          />
          {!isPlaying && (
            <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition">
                <Play className="h-7 w-7 translate-x-0.5 text-white" />
              </div>
            </button>
          )}
          <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-xs font-mono text-white/80">
            {fmt(elapsed)} / {fmt(duration)}
          </div>
          <span className="absolute top-3 right-12 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
            <Coins className="h-3.5 w-3.5 text-yellow-400" /> KES {task.rewardCoins}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 px-4 pt-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={rewind}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button size="icon" className="h-8 w-8" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
          </Button>
          <input
            type="range" min={0} max={duration || 0} step={0.1} value={elapsed}
            onChange={handleSeek}
            className="flex-1 h-1.5 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
          />
        </div>

        {/* Submission form */}
        <div className="p-4 space-y-3">
          <h3 className="text-base font-semibold">{task.title}</h3>
          {result?.success ? (
            <div className="flex flex-col items-center gap-2 py-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="text-sm font-medium text-green-500">Submitted! +KES {task.rewardCoins} pending review</p>
            </div>
          ) : (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe what you see in this video..."
                className="w-full min-h-[100px] rounded-xl border border-border bg-transparent p-3 text-sm outline-none focus:border-primary resize-none"
                disabled={isPending}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{wordCount} words (min 5)</span>
                {result?.error && <span className="text-xs text-red-500">{result.error}</span>}
              </div>
              <Button className="w-full gap-2" disabled={wordCount < 5 || isPending} onClick={handleSubmit}>
                {isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                ) : (
                  <><Send className="h-4 w-4" /> Submit Description</>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Fullscreen Image Modal ────────────────────────────────────────────

function ImageModal({
  task,
  onClose,
  onComplete,
}: {
  task: ImageTask;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const handleSubmit = () => {
    if (wordCount < 3) return;
    startTransition(async () => {
      const res = await submitTranscription(task.id, text);
      setResult(res);
      if (res.success) setTimeout(() => { onComplete(); onClose(); }, 1200);
    });
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Large Image */}
        <div className="relative w-full bg-zinc-900 rounded-t-2xl overflow-hidden">
          {task.thumbnailUrl ? (
            <img src={task.thumbnailUrl} alt={task.title} className="w-full object-contain max-h-[50vh]" />
          ) : (
            <div className="flex h-48 items-center justify-center">
              <Image className="h-12 w-12 text-white/40" />
            </div>
          )}
          <span className="absolute top-3 right-12 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
            <Coins className="h-3.5 w-3.5 text-yellow-400" /> KES {task.rewardCoins}
          </span>
        </div>

        {/* Submission form */}
        <div className="p-4 space-y-3">
          <h3 className="text-base font-semibold">{task.title}</h3>
          {result?.success ? (
            <div className="flex flex-col items-center gap-2 py-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="text-sm font-medium text-green-500">Submitted! +KES {task.rewardCoins} pending review</p>
            </div>
          ) : (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe what you see in this image in detail..."
                className="w-full min-h-[100px] rounded-xl border border-border bg-transparent p-3 text-sm outline-none focus:border-primary resize-none"
                disabled={isPending}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{wordCount} words (min 3)</span>
                {result?.error && <span className="text-xs text-red-500">{result.error}</span>}
              </div>
              <Button className="w-full gap-2" disabled={wordCount < 3 || isPending} onClick={handleSubmit}>
                {isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                ) : (
                  <><Send className="h-4 w-4" /> Submit Description</>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Thumbnail Cards (Grid) ────────────────────────────────────────────

function VideoThumb({ task, onClick }: { task: MediaTask; onClick: () => void }) {
  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md group" onClick={onClick}>
      <div className="relative aspect-video bg-zinc-900">
        {task.thumbnailUrl ? (
          <img src={task.thumbnailUrl} alt={task.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="flex h-full items-center justify-center"><Video className="h-8 w-8 text-white/40" /></div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Play className="h-4 w-4 text-white translate-x-0.5" />
          </div>
        </div>
        <span className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
          <Coins className="h-3 w-3 text-yellow-400" /> KES {task.rewardCoins}
        </span>
      </div>
      <CardContent className="p-2.5">
        <p className="text-xs font-medium truncate">{task.title}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">Tap to describe</p>
      </CardContent>
    </Card>
  );
}

function ImageThumb({ task, onClick }: { task: ImageTask; onClick: () => void }) {
  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md group" onClick={onClick}>
      <div className="relative aspect-video bg-zinc-900">
        {task.thumbnailUrl ? (
          <img src={task.thumbnailUrl} alt={task.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="flex h-full items-center justify-center"><Image className="h-8 w-8 text-white/40" /></div>
        )}
        <span className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
          <Coins className="h-3 w-3 text-yellow-400" /> KES {task.rewardCoins}
        </span>
      </div>
      <CardContent className="p-2.5">
        <p className="text-xs font-medium truncate">{task.title}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">Tap to describe</p>
      </CardContent>
    </Card>
  );
}

// ─── Submission History ────────────────────────────────────────────────

const statusConfig: Record<string, { icon: React.ReactNode; label: string; cls: string }> = {
  PENDING_REVIEW: { icon: <Clock className="h-3.5 w-3.5" />, label: "Pending", cls: "text-yellow-500" },
  APPROVED: { icon: <CheckCircle className="h-3.5 w-3.5" />, label: "Approved", cls: "text-green-500" },
  REJECTED: { icon: <XCircle className="h-3.5 w-3.5" />, label: "Rejected", cls: "text-red-500" },
};

function SubmissionHistory({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Submissions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {submissions.map((s) => {
          const cfg = statusConfig[s.status] ?? statusConfig.PENDING_REVIEW;
          return (
            <div key={s.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(s.createdAt).toLocaleDateString()} · +KES {s.rewardCoins}
                </p>
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-medium ${cfg.cls}`}>
                {cfg.icon}
                {cfg.label}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ─── Main Unified Tasks Client ─────────────────────────────────────────

export function UnifiedTasksClient({
  videoTask,
  imageTasks,
  todayCount,
  dailyLimit,
  limitReached,
  noVideoTasks,
  noImageTasks,
  submissions,
}: UnifiedTasksClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Category>("videos");
  const [count, setCount] = useState(todayCount);
  const [selectedVideo, setSelectedVideo] = useState<MediaTask | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageTask | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  // Load all 10 video tasks
  const [allVideoTasks, setAllVideoTasks] = useState<MediaTask[]>(videoTask ? [videoTask] : []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (allVideoTasks.length >= 10 || limitReached || noVideoTasks) return;
    setLoading(true);
    import("@/actions/transcription").then(async (mod) => {
      const tasks: MediaTask[] = [];
      const seen = new Set(allVideoTasks.map((t) => t.id));
      for (let i = 0; i < 12 && tasks.length < 10; i++) {
        try {
          const data = await mod.getNextTask();
          if (data.limitReached || !data.task) break;
          if (!seen.has(data.task.id)) {
            tasks.push(data.task);
            seen.add(data.task.id);
          }
        } catch { break; }
      }
      if (tasks.length > 0) {
        setAllVideoTasks((prev) => {
          const ids = new Set(prev.map((t) => t.id));
          const merged = [...prev];
          for (const t of tasks) {
            if (!ids.has(t.id)) { merged.push(t); ids.add(t.id); }
          }
          return merged.slice(0, 10);
        });
      }
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleComplete = (taskId: string) => {
    setCount((c) => c + 1);
    setCompletedIds((prev) => new Set(prev).add(taskId));
    setTimeout(() => router.refresh(), 500);
  };

  // Daily limit
  if (limitReached || count >= dailyLimit) {
    return (
      <div className="space-y-6">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <Trophy className="h-16 w-16 text-primary" />
            <h2 className="text-xl font-bold">Daily Limit Reached!</h2>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              You&apos;ve completed all {dailyLimit} tasks for today. Come back tomorrow!
            </p>
            <div className="text-sm font-medium">{count}/{dailyLimit} tasks done today</div>
          </CardContent>
        </Card>
        <SubmissionHistory submissions={submissions} />
      </div>
    );
  }

  const activeVideos = allVideoTasks.filter((t) => !completedIds.has(t.id));
  const activeImages = imageTasks.filter((t) => !completedIds.has(t.id));

  return (
    <div className="space-y-4">
      {/* Daily Progress */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Daily Progress</span>
          <span className="text-xs text-muted-foreground">{count}/{dailyLimit}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="progress-bar w-32">
            <div className="progress-bar-fill" style={{ width: `${(count / dailyLimit) * 100}%` }} />
          </div>
          <span className="text-xs font-medium">{Math.round((count / dailyLimit) * 100)}%</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 rounded-xl border border-border bg-card p-1">
        <button
          onClick={() => setTab("videos")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
            tab === "videos"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <Video className="h-4 w-4" />
          <span className="hidden sm:inline">Video</span>
          <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">KES 35-55</span>
        </button>
        <button
          onClick={() => setTab("images")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
            tab === "images"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <Image className="h-4 w-4" />
          <span className="hidden sm:inline">Image</span>
          <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">KES 15-30</span>
        </button>
      </div>

      {/* Tasks Grid */}
      {tab === "videos" ? (
        loading && activeVideos.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : noVideoTasks && activeVideos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
              <h2 className="text-lg font-bold">No Video Tasks Available</h2>
              <p className="text-sm text-muted-foreground text-center">
                Try image tasks or check back later!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 grid-cols-2">
            {activeVideos.map((task) => (
              <VideoThumb key={task.id} task={task} onClick={() => setSelectedVideo(task)} />
            ))}
          </div>
        )
      ) : (
        noImageTasks || activeImages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
              <h2 className="text-lg font-bold">No Image Tasks Available</h2>
              <p className="text-sm text-muted-foreground text-center">
                Try video tasks or check back later!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 grid-cols-2">
            {activeImages.map((task) => (
              <ImageThumb key={task.id} task={task} onClick={() => setSelectedImage(task)} />
            ))}
          </div>
        )
      )}

      {/* Modals */}
      {selectedVideo && (
        <VideoModal
          task={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onComplete={() => handleComplete(selectedVideo.id)}
        />
      )}
      {selectedImage && (
        <ImageModal
          task={selectedImage}
          onClose={() => setSelectedImage(null)}
          onComplete={() => handleComplete(selectedImage.id)}
        />
      )}

      <SubmissionHistory submissions={submissions} />
    </div>
  );
}
