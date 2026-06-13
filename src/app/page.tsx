import { ButtonLink } from "@/components/button-link";
import { PageShell } from "@/components/page-shell";

const steps = [
  ["01", "Watch", "Learn naturally from any technical lecture or workshop."],
  ["02", "Test", "Check understanding with questions grounded in the source."],
  ["03", "Replay", "Jump back to the exact moment behind a misconception."],
];

export default function Home() {
  return (
    <PageShell>
      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cce1d4] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
            <span className="size-1.5 rounded-full bg-[var(--accent)]" />
            Timestamp-aware learning
          </div>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            The tutor that knows exactly where you got lost.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            StudyReplay turns lectures into an active learning loop. Ask,
            answer, and revisit the precise video moment that makes a concept
            click.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/demo">Explore the demo</ButtonLink>
            <ButtonLink href="/videos" variant="secondary">
              View video library
            </ButtonLink>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[var(--muted)]">
            <span>No API keys required</span>
            <span>Deterministic demo mode</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[#dbece2]/65 blur-2xl" />
          <div className="overflow-hidden rounded-[2rem] border border-[#cfdbd3] bg-[#18231d] p-4 shadow-[0_24px_70px_rgba(29,66,45,0.18)]">
            <div className="flex items-center justify-between px-2 pb-4 text-xs text-white/65">
              <span>Technical AI Workshop</span>
              <span>12:48</span>
            </div>
            <div className="grid min-h-64 place-items-center rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_30%,#345f49,#17231d_65%)] p-8 text-center text-white">
              <div>
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-white text-xl text-[var(--accent-strong)] shadow-xl">
                  ▶
                </span>
                <p className="mt-5 text-sm font-semibold">Context caching vs model routing</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-white p-5 text-[var(--foreground)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--warning)]">
                    Revisit this moment
                  </p>
                  <p className="mt-1 font-semibold">You may be mixing up two optimization strategies.</p>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--warning-soft)] px-3 py-1.5 text-sm font-bold text-[var(--warning)]">
                  03:14–04:02
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-white/70">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
            A tighter learning loop
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map(([number, title, description]) => (
              <article className="rounded-2xl border border-[var(--border)] bg-white p-6" key={number}>
                <span className="text-sm font-bold text-[var(--accent)]">{number}</span>
                <h2 className="mt-5 text-2xl font-bold tracking-tight">{title}</h2>
                <p className="mt-3 leading-7 text-[var(--muted)]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
