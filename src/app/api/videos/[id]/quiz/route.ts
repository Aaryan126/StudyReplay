import { z } from "zod";

import { QuizService } from "@/server/services/quiz-service";

const generateQuizSchema = z.object({
  count: z.number().int().min(1).max(5).optional(),
});

type QuizRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: QuizRouteContext) {
  const { id } = await params;
  try {
    return Response.json({ data: new QuizService().list(id) });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to load quiz." },
      { status: 404 },
    );
  }
}

export async function POST(request: Request, { params }: QuizRouteContext) {
  const { id } = await params;
  let body: unknown = {};

  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = generateQuizSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  try {
    const questions = await new QuizService().generate(id, parsed.data.count ?? 3);
    return Response.json({ data: questions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate quiz.";
    return Response.json(
      { error: message },
      { status: message === "Video not found." ? 404 : 502 },
    );
  }
}
