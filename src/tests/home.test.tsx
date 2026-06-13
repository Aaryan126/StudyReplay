import { render, screen } from "@testing-library/react";

import Home from "@/app/page";

describe("Home", () => {
  it("renders the StudyReplay landing page", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /turn any lecture into a tutor that remembers every timestamp/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /open demo workspace/i }),
    ).toHaveAttribute("href", "/demo");
  });
});
