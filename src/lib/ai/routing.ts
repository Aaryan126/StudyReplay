export type AITask = "explanation" | "quiz" | "misconception" | "practice" | "summary" | "chapters";
export type RoutedProvider = "mock" | "kimi" | "tokenrouter";

export type RoutingAvailability = {
  kimi: boolean;
  tokenrouter: boolean;
};

export type RoutingDecision = {
  provider: RoutedProvider;
  complexity: "simple" | "complex";
  reason: string;
};

export function chooseRoutingDecision(
  task: AITask,
  availability: RoutingAvailability,
): RoutingDecision {
  const complex = task === "misconception" || task === "practice";
  if (complex && availability.kimi) {
    return { provider: "kimi", complexity: "complex", reason: "Complex learner reasoning routes to Kimi." };
  }
  if (!complex && availability.tokenrouter) {
    return { provider: "tokenrouter", complexity: "simple", reason: "Simple extraction and formatting routes through TokenRouter." };
  }
  return {
    provider: "mock",
    complexity: complex ? "complex" : "simple",
    reason: `Configured ${complex ? "Kimi" : "TokenRouter"} route is unavailable; using deterministic fallback.`,
  };
}
