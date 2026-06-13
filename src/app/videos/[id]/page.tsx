import { RoutePlaceholder } from "@/components/route-placeholder";

type VideoWorkspacePageProps = {
  params: Promise<{ id: string }>;
};

export default async function VideoWorkspacePage({
  params,
}: VideoWorkspacePageProps) {
  const { id } = await params;

  return (
    <RoutePlaceholder
      description={`The workspace route for video “${id}” is ready for the Phase 1 interface.`}
      eyebrow="Video workspace"
      title="A focused place to watch, ask, test, and revisit."
    />
  );
}
