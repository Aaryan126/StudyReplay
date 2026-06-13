import { z } from "zod";

import { PracticeService } from "@/server/services/practice-service";

const schema = z.object({
  questionId: z.string().trim().min(1),
  misconception: z.string().trim().max(2_000).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
    }
    return Response.json({ data: await new PracticeService().generate(parsed.data.questionId, parsed.data.misconception) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create practice.";
    return Response.json({ error: message }, { status: message === "Quiz question not found." ? 404 : 502 });
  }
}
