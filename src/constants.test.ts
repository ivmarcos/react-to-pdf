import { describe, test, expect } from "vitest";
import {
  MM_TO_PX,
  PREVIEW_ROOT_CLASS_NAME,
  OFFSCREEN_POSITION,
  Resolution,
  Margin,
  Alignment,
  Size,
  DEFAULT_OPTIONS,
} from "./constants";

describe("Constants", () => {
  test("should have correct MM_TO_PX conversion factor", () => {
    expect(MM_TO_PX).toBe(3.77952755906);
  });

  test("should have correct preview root class name", () => {
    expect(PREVIEW_ROOT_CLASS_NAME).toBe("react-to-pdf--preview");
  });

  test("should have correct offscreen position", () => {
    expect(OFFSCREEN_POSITION).toBe("-10000rem");
  });

  describe("Resolution enum", () => {
    test("should have all resolution values", () => {
      expect(Resolution.LOW).toBe(1);
      expect(Resolution.NORMAL).toBe(2);
      expect(Resolution.MEDIUM).toBe(3);
      expect(Resolution.HIGH).toBe(7);
      expect(Resolution.EXTREME).toBe(12);
    });
  });

  describe("Margin enum", () => {
    test("should have all margin values", () => {
      expect(Margin.NONE).toBe(0);
      expect(Margin.SMALL).toBe(5);
      expect(Margin.MEDIUM).toBe(10);
      expect(Margin.LARGE).toBe(25);
    });
  });

  describe("Alignment", () => {
    test("should have all alignment values", () => {
      expect(Alignment.TOP_LEFT).toBe("top-left");
      expect(Alignment.CENTER_Y).toBe("center-y");
      expect(Alignment.CENTER_X).toBe("center-x");
      expect(Alignment.CENTER_XY).toBe("center-xy");
    });
  });

  describe("Size", () => {
    test("should have all size values", () => {
      expect(Size.ORIGINAL).toBe("original");
      expect(Size.FILL_PAGE).toBe("fill-page");
      expect(Size.SHRINK_TO_FIT).toBe("shrink-to-fit");
    });
  });

  describe("DEFAULT_OPTIONS", () => {
    test("should have correct default resolution", () => {
      expect(DEFAULT_OPTIONS.resolution).toBe(Resolution.MEDIUM);
    });

    test("should have correct default page settings", () => {
      expect(DEFAULT_OPTIONS.page.margin).toBe(Margin.NONE);
      expect(DEFAULT_OPTIONS.page.format).toBe("A4");
      expect(DEFAULT_OPTIONS.page.orientation).toBe("portrait");
    });

    test("should have correct default canvas settings", () => {
      expect(DEFAULT_OPTIONS.canvas.mimeType).toBe("image/jpeg");
      expect(DEFAULT_OPTIONS.canvas.qualityRatio).toBe(0.9);
      expect(DEFAULT_OPTIONS.canvas.useCORS).toBe(true);
      expect(DEFAULT_OPTIONS.canvas.logging).toBe(false);
    });

    test("should have correct default alignment and size", () => {
      expect(DEFAULT_OPTIONS.align).toBe(Alignment.TOP_LEFT);
      expect(DEFAULT_OPTIONS.size).toBe(Size.ORIGINAL);
    });

    test("should have correct header and footer defaults", () => {
      expect(DEFAULT_OPTIONS.header.margin).toBe(7);
      expect(DEFAULT_OPTIONS.header.align).toBe("center");
      expect(DEFAULT_OPTIONS.footer.margin).toBe(7);
      expect(DEFAULT_OPTIONS.footer.align).toBe("center");
    });
  });
});
