import { z } from "zod";

import { PracticeService } from "@/server/services/practice-service";

const schema = z.object({
  sandboxId: z.string().trim().min(1),
  code: z.string().min(1).max(20_000),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
    }
    return Response.json({ data: await new PracticeService().run(parsed.data.sandboxId, parsed.data.code) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to run practice.";
    return Response.json({ error: message }, { status: 502 });
  }
}
