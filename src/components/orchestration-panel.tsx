"use client";

import { useEffect, useState } from "react";

import { Panel } from "@/components/panel";
import { ToolCallTimeline } from "@/components/tool-call-timeline";
import type { ToolCallLog } from "@/lib/types";
import { ORCHESTRATION_UPDATED_EVENT } from "@/lib/utils/orchestration-events";

export function OrchestrationPanel({ initialItems }: { initialItems: ToolCallLog[] }) {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    async function refresh() {
      const response = await fetch("/api/logs");
      const body = (await response.json()) as { data?: ToolCallLog[] };
      if (response.ok && body.data) setItems(body.data);
    }
    window.addEventListener(ORCHESTRATION_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(ORCHESTRATION_UPDATED_EVENT, refresh);
  }, []);

  return (
    <Panel description="Routing, cache, provider latency, and fallback decisions" title="Orchestration log">
      <ToolCallTimeline items={items.slice(-12).reverse()} />
    </Panel>
  );
}
