import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ArchiveRow, ExternalSource, formatRecordDate } from "./ResearchUI";
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

describe("source and date labels", () => {
  it("opens a cited source without implying a classification", () => {
    render(
      <ExternalSource
        url="https://cert.gov.ua/article/6284730"
        title="UAC-0001 cyberattacks using LAMEHUG"
        origin="MITRE ATLAS reference"
      />,
    );
    expect(screen.getByText("Named by ATLAS")).toBeInTheDocument();
    expect(screen.getByText("Open source")).toBeInTheDocument();
  });

  it("shows month-level dates without inventing a day", () => {
    expect(formatRecordDate("2025-06-03", "Month")).toBe("Jun 2025");
  });
});
