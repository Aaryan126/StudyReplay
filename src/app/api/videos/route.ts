import { listVideos } from "@/lib/db/demo-store";

export function GET() {
  return Response.json({
    data: listVideos(),
    mode: "mock",
  });
}
