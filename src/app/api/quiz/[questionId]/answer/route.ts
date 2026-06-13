import { z } from "zod";

import { AnswerGradingService } from "@/server/services/answer-grading-service";

const answerRequestSchema = z.object({
  answer: z.string().trim().min(1, "Answer is required.").max(2_000),
});

type AnswerRouteContext = {
  params: Promise<{ questionId: string }>;
};

export async function POST(request: Request, { params }: AnswerRouteContext) {
  const { questionId } = await params;
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = answerRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  try {
    const feedback = await new AnswerGradingService().grade(
      questionId,
      parsed.data.answer,
    );
    return Response.json({ data: feedback });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to grade answer.";
    return Response.json(
      { error: message },
      { status: message === "Quiz question not found." ? 404 : 502 },
    );
  }
}
