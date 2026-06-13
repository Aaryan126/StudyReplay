import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { LearningWorkspaceClient } from "@/components/learning-workspace-client";

describe("TutorPanel interaction", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("asks a question, renders evidence, and selects its timestamp", async () => {
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response(JSON.stringify({
        data: {
          answer: "Context caching reuses prior work.",
          evidence: [{ startSec: 194, endSec: 242, reason: "Definition" }],
          confidence: "high",
          followUpSuggestions: [],
          provider: "Mock",
          latencyMs: 8,
          cached: true,
        },
      }), { status: 200, headers: { "Content-Type": "application/json" } }),
    ));

    render(
      <LearningWorkspaceClient
        video={{ id: "video", title: "Workshop", durationSeconds: 768 }}
      />,
    );

    fireEvent.change(screen.getByRole("textbox", { name: /ask a question/i }), {
      target: { value: "What is context caching?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ask" }));

    expect(await screen.findByText(/reuses prior work/i)).toBeInTheDocument();
    expect(screen.getByText(/cached/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "03:14–04:02" }));
    await waitFor(() => {
      expect(screen.getByLabelText("Current video timestamp")).toHaveTextContent("03:14");
    });
  });
});
