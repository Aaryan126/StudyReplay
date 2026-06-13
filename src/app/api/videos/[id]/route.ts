import { getChaptersByVideoId, getQuizQuestionsByVideoId, getTranscriptByVideoId, getVideoById } from "@/lib/db/demo-store";

type VideoRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: VideoRouteContext) {
  const { id } = await params;
  const video = getVideoById(id);

  if (!video) {
    return Response.json({ error: "Video not found" }, { status: 404 });
  }

  return Response.json({
    data: {
      video,
      chapters: getChaptersByVideoId(id),
      transcript: getTranscriptByVideoId(id),
      quiz: getQuizQuestionsByVideoId(id),
    },
    mode: "mock",
  });
}
