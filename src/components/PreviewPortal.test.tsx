import { describe, test, expect } from "vitest";
import { PREVIEW_ROOT_CLASS_NAME } from "../constants";

describe("PreviewPortal Component", () => {
  test("should have PREVIEW_ROOT_CLASS_NAME constant defined", () => {
    expect(PREVIEW_ROOT_CLASS_NAME).toBe("react-to-pdf--preview");
  });

  test("should export PreviewPortal component", async () => {
    const module = await import("./PreviewPortal");
    expect(module.PreviewPortal).toBeDefined();
    expect(typeof module.PreviewPortal).toBe("function");
  });
});
