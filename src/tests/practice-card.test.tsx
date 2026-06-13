import { fireEvent, render, screen } from "@testing-library/react";

import { PracticeCard } from "@/components/practice-card";

describe("PracticeCard", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("shows sandbox status and run output", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        data: {
          task: {
            title: "Practice caching",
            instructions: "Complete the script.",
            starterCode: 'console.log("caching and model routing");',
            successCriteria: ["Mention both concepts"],
          },
          sandboxId: "sandbox-1",
          sandboxProvider: "Daytona",
          sandboxStatus: "ready",
          output: "Initial run",
          exitCode: 0,
        },
      }), { status: 200, headers: { "Content-Type": "application/json" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        data: { exitCode: 0, output: "PASS from Daytona" },
      }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetcher);

    render(<PracticeCard misconception="Caching vs routing" questionId="q1" />);
    fireEvent.click(screen.getByRole("button", { name: /practice this/i }));
    expect(await screen.findByText("Daytona ready")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /run in sandbox/i }));
    expect(await screen.findByText(/PASS from Daytona/)).toBeInTheDocument();
  });

  it("keeps the exercise available in fallback mode", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      data: {
        task: {
          title: "Practice caching",
          instructions: "Explain the distinction.",
          starterCode: "// text exercise",
          successCriteria: ["Accurate explanation"],
        },
        sandboxProvider: "Daytona",
        sandboxStatus: "fallback",
        fallbackReason: "Quota exceeded",
      },
    }), { status: 200, headers: { "Content-Type": "application/json" } })));

    render(<PracticeCard misconception="Caching vs routing" questionId="q1" />);
    fireEvent.click(screen.getByRole("button", { name: /practice this/i }));
    expect(await screen.findByText("Text-only fallback")).toBeInTheDocument();
    expect(screen.getByText(/Quota exceeded/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /run in sandbox/i })).not.toBeInTheDocument();
  });
});
