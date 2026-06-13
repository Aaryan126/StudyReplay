import { render, screen, waitFor } from "@testing-library/react";

import { OrchestrationPanel } from "@/components/orchestration-panel";
import { ORCHESTRATION_UPDATED_EVENT } from "@/lib/utils/orchestration-events";

describe("OrchestrationPanel", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("refreshes after an interaction and shows routing/cache decisions", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      data: [{
        id: "route-1",
        tool: "TokenRouter",
        operation: "Cache hit · timestamp explanation",
        status: "success",
        latencyMs: 1,
        outputSummary: "Returned cached response.",
        createdAt: new Date().toISOString(),
      }],
    }), { status: 200, headers: { "Content-Type": "application/json" } })));

    render(<OrchestrationPanel initialItems={[]} />);
    window.dispatchEvent(new Event(ORCHESTRATION_UPDATED_EVENT));

    await waitFor(() => expect(screen.getByText(/cache hit · timestamp explanation/i)).toBeInTheDocument());
    expect(screen.getByText("TokenRouter")).toBeInTheDocument();
  });
});
