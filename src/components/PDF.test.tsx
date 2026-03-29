import { describe, test, expect } from "vitest";
import { PDFContext, containerStyle } from "./PDF";
import { OFFSCREEN_POSITION } from "../constants";

describe("PDF Component", () => {
  test("should have PDFContext defined", () => {
    expect(PDFContext).toBeDefined();
  });

  test("should have containerStyle defined with correct properties", () => {
    expect(containerStyle).toBeDefined();
    expect(containerStyle.width).toBe("fit-content");
    expect(containerStyle.position).toBe("fixed");
  });

  test("containerStyle should have hidden positioning", () => {
    expect(containerStyle.left).toBe(OFFSCREEN_POSITION);
  });
});
