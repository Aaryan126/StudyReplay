import { ButtonLink } from "@/components/button-link";
import { PageShell } from "@/components/page-shell";

type RoutePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function RoutePlaceholder({
  eyebrow,
  title,
  description,
}: RoutePlaceholderProps) {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-6 py-24">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          {eyebrow}
        </p>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          {description}
        </p>
        <div className="mt-8">
          <ButtonLink href="/" variant="secondary">
            Back to home
          </ButtonLink>
        </div>
      </section>
    </PageShell>
  );
}
