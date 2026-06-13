import { render, screen } from "@testing-library/react";

import VideoWorkspacePage from "@/app/videos/[id]/page";
import { DEMO_VIDEO_ID } from "@/lib/db/demo-data";

describe("VideoWorkspacePage", () => {
  it("renders a populated demo workspace route", async () => {
    render(await VideoWorkspacePage({ params: Promise.resolve({ id: DEMO_VIDEO_ID }) }));

    expect(screen.getByRole("heading", { name: /building fast ai systems/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /video player/i })).toBeInTheDocument();
    expect(screen.getByText("Caching versus routing")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /ask studyreplay/i })).toBeInTheDocument();
    expect(screen.getByText(/what is the difference between context caching and model routing/i)).toBeInTheDocument();
  });
});
