import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ArchiveRow } from "./ResearchUI";
import { seed } from "../data/model";

describe("ArchiveRow", () => {
  it("labels research demonstrations explicitly", () => {
    render(
      <MemoryRouter>
        <ArchiveRow record={seed.research_demonstrations[0]} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Research Demonstration")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/incidents/${seed.research_demonstrations[0].id}`,
    );
  });
});
