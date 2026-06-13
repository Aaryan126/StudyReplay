import { ButtonLink } from "@/components/button-link";
import { PageShell } from "@/components/page-shell";

const foundations = [
  "Timestamp-aware learning",
  "Grounded tutor responses",
  "Mock-first sponsor adapters",
];

export default function Home() {
  return (
    <PageShell>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Learn from the moment you missed
          </p>
          <h1 className="max-w-3xl text-5xl font-bold tracking-[-0.04em] sm:text-6xl">
            Turn any lecture into a tutor that remembers every timestamp.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            StudyReplay identifies misconceptions, finds the exact source
            segment, and guides learners back with focused explanations and
            practice.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/demo">Open demo workspace</ButtonLink>
            <ButtonLink href="/videos" variant="secondary">
              Browse videos
            </ButtonLink>
          </div>
        </div>

        <aside className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm">
          <p className="text-sm font-semibold text-[var(--muted)]">
            Phase 0 foundation
          </p>
          <ul className="mt-5 space-y-4">
            {foundations.map((item) => (
              <li className="flex items-center gap-3" key={item}>
                <span className="size-2 rounded-full bg-[var(--accent)]" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </PageShell>
  );
}
