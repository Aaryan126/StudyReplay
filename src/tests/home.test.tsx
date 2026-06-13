import { render, screen } from "@testing-library/react";

import Home from "@/app/page";

describe("Home", () => {
  it("renders the StudyReplay landing page", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /the tutor that knows exactly where you got lost/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /explore the demo/i }),
    ).toHaveAttribute("href", "/demo");
  });
});
