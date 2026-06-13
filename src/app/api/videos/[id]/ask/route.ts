import { z } from "zod";

import { getVideoById } from "@/lib/db/demo-store";
import { TutorService } from "@/server/services/tutor-service";

const askRequestSchema = z.object({
  question: z.string().trim().min(2, "Question is required.").max(500),
});

type AskRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: AskRouteContext) {
  const { id } = await params;

  if (!getVideoById(id)) {
    return Response.json({ error: "Video not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = askRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  try {
    const result = await new TutorService().ask(id, parsed.data.question);
    return Response.json({ data: result });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to answer question." },
      { status: 502 },
    );
  }
}
