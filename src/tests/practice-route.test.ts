import { POST as generatePractice } from "@/app/api/practice/generate/route";
import { POST as runPractice } from "@/app/api/practice/run/route";

function jsonRequest(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("practice routes", () => {
  it("generates and runs a sandbox practice session", async () => {
    const generated = await generatePractice(jsonRequest("http://localhost/api/practice/generate", {
      questionId: "quiz-cache-routing",
      misconception: "Context caching vs model routing",
    }));
    const body = await generated.json();

    expect(generated.status).toBe(200);
    expect(body.data.sandboxStatus).toBe("ready");

    const run = await runPractice(jsonRequest("http://localhost/api/practice/run", {
      sandboxId: body.data.sandboxId,
      code: 'console.log("Caching reuses work; routing selects a model");',
    }));
    const runBody = await run.json();
    expect(run.status).toBe(200);
    expect(runBody.data.exitCode).toBe(0);
  });

  it("validates generation input", async () => {
    const response = await generatePractice(jsonRequest("http://localhost/api/practice/generate", {}));
    expect(response.status).toBe(400);
  });
});
