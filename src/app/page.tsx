import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckSquare, BarChart3, Zap, Shield } from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="font-bold text-xl">Junerty</span>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/15%,transparent)]" />
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Build faster with
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {" "}
              modern tools
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A production-ready platform with task management, analytics, and
            team collaboration. Get started in minutes.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2 text-base">
                Start free trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-base">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold">
            Everything you need to succeed
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            A complete toolkit for modern teams
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <CheckSquare className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-semibold">Task Management</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Kanban boards, list views, and full CRUD. Assign tasks and track
                progress.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <BarChart3 className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-semibold">Analytics Dashboard</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Visualize your data with charts and metrics. Make informed
                decisions.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <Zap className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-semibold">Lightning Fast</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Built with Next.js and optimized for performance. Instant page
                loads.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <Shield className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-semibold">Secure by default</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                NextAuth authentication, protected routes, and secure sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands of teams already using Junerty.
          </p>
          <Link href="/auth/register" className="mt-8 inline-block">
            <Button size="lg" className="gap-2">
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Junerty. Built with Next.js, Prisma, and
          Tailwind.
        </div>
      </footer>
    </div>
  );
}
