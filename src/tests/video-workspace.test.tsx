import { render, screen } from "@testing-library/react";

import VideoWorkspacePage from "@/app/videos/[id]/page";

describe("VideoWorkspacePage", () => {
  it("renders the video workspace route", async () => {
    render(
      await VideoWorkspacePage({
        params: Promise.resolve({ id: "demo-video" }),
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: /a focused place to watch, ask, test, and revisit/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/demo-video/i)).toBeInTheDocument();
  });
});
