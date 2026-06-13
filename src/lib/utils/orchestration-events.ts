export const ORCHESTRATION_UPDATED_EVENT = "studyreplay:orchestration-updated";

export function notifyOrchestrationUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ORCHESTRATION_UPDATED_EVENT));
  }
}
