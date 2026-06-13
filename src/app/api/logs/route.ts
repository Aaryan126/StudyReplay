import { listToolLogs } from "@/lib/db/demo-store";

export async function GET() {
  return Response.json({ data: listToolLogs() });
}
