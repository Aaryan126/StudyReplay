export function GET() {
  return Response.json({
    status: "ok",
    service: "study-replay",
    mode: process.env.DEMO_MODE === "false" ? "configured" : "mock",
  });
}
