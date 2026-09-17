import axe from "axe-core";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { IncidentsPage } from "./IncidentsPage";

describe("archive accessibility", () => {
  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/incidents"]}>
        <IncidentsPage />
      </MemoryRouter>,
    );

    const result = await axe.run(container, {
      rules: {
        region: { enabled: false },
      },
    });
    expect(result.violations).toEqual([]);
  });
});
