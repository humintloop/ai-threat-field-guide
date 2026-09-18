import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { CaseDetailPage } from "./CaseDetailPage";
import { trail } from "../data/trail";

function renderCase(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/incidents/${id}`]}>
      <Routes>
        <Route path="/incidents/:id" element={<CaseDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("archive case copy", () => {
  it("frames LAMEHUG as a standard record after leaving the essay", () => {
    renderCase("ATFG-0010");
    expect(screen.getByRole("heading", { name: "This is a standard archive record." })).toBeInTheDocument();
    expect(screen.getByText(/The trail you were reading is a Field Guide essay/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What MITRE recorded" })).toBeInTheDocument();
    expect(screen.getByText(/canonical account, not a Field Guide rewrite/)).toBeInTheDocument();
    expect(screen.getByText(trail[2].onward.reason)).toBeInTheDocument();
  });

  it("opens the technical read with named methods instead of a mapping dump", async () => {
    const user = userEvent.setup();
    const { container } = renderCase("ATFG-0010");
    const summary = container.querySelector(".technical-disclosure > summary");
    expect(summary).toHaveTextContent("Named methods, recorded steps, and what this resembles");
    await user.click(summary!);
    const disclosure = container.querySelector(".technical-disclosure");
    expect(within(disclosure as HTMLElement).getByText("Named methods")).toBeInTheDocument();
    expect(within(disclosure as HTMLElement).getByText(/ATLAS is MITRE’s catalog/)).toBeInTheDocument();
    expect(within(disclosure as HTMLElement).getByText("What they did, in order")).toBeInTheDocument();
    expect(within(disclosure as HTMLElement).getByText("What this resembles")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /See what this case connects to/ })).toBeInTheDocument();
  });

  it("gives a non-trail incident the pinned account without a leaving-essay notice", () => {
    renderCase("ATFG-0008");
    expect(screen.queryByRole("heading", { name: "This is a standard archive record." })).toBeNull();
    expect(screen.getByRole("heading", { name: "What MITRE recorded" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Where this comes from." })).toBeInTheDocument();
  });

  it("keeps trail case titles grounded and does not restack the card pitch under the headline", () => {
    renderCase("ATFG-0001");
    expect(screen.getByRole("heading", { level: 1, name: "Later runs found named folders in Artifactory." })).toBeInTheDocument();
    expect(screen.queryByText(/No manager/)).toBeNull();
    expect(screen.getByText("Autonomous OpenAI Evaluation Agents Compromise Hugging Face Infrastructure")).toBeInTheDocument();
  });

  it("keeps the unsuccessful Hermes outcome visible on the case page", () => {
    renderCase("ATFG-0004");
    expect(screen.getByRole("heading", { level: 1, name: "The autonomous Langflow and n8n attempts did not get in." })).toBeInTheDocument();
    expect(screen.getAllByText(/None of the autonomous/).length).toBeGreaterThan(0);
  });

  it("keeps the Taiwan attribution limit visible", () => {
    renderCase("ATFG-0002");
    expect(screen.getAllByText("On who did this").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Do not infer state sponsorship from language or geography/).length).toBeGreaterThan(0);
  });
});
