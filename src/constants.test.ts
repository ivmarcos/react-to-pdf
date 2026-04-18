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
  test("MM_TO_PX conversion factor", () => {
    expect(MM_TO_PX).toBe(3.77952755906);
  });

  test("preview root class name", () => {
    expect(PREVIEW_ROOT_CLASS_NAME).toBe("react-to-pdf--preview");
  });

  test("offscreen position", () => {
    expect(OFFSCREEN_POSITION).toBe("-10000rem");
  });

  describe("Resolution", () => {
    test("has all resolution values", () => {
      expect(Resolution.LOW).toBe(1);
      expect(Resolution.NORMAL).toBe(2);
      expect(Resolution.MEDIUM).toBe(3);
      expect(Resolution.HIGH).toBe(7);
      expect(Resolution.EXTREME).toBe(12);
    });
  });

  describe("Margin", () => {
    test("has all margin values", () => {
      expect(Margin.NONE).toBe(0);
      expect(Margin.SMALL).toBe(5);
      expect(Margin.MEDIUM).toBe(10);
      expect(Margin.LARGE).toBe(25);
    });
  });

  describe("Alignment", () => {
    test("has all alignment values", () => {
      expect(Alignment.TOP_LEFT).toBe("top-left");
      expect(Alignment.CENTER_Y).toBe("center-y");
      expect(Alignment.CENTER_X).toBe("center-x");
      expect(Alignment.CENTER_XY).toBe("center-xy");
    });
  });

  describe("Size", () => {
    test("has all size values", () => {
      expect(Size.ORIGINAL).toBe("original");
      expect(Size.FILL_PAGE).toBe("fill-page");
      expect(Size.SHRINK_TO_FIT).toBe("shrink-to-fit");
    });
  });

  describe("DEFAULT_OPTIONS", () => {
    test("defaults to canvas engine", () => {
      expect(DEFAULT_OPTIONS.engine).toBe("canvas");
    });

    test("default page geometry", () => {
      expect(DEFAULT_OPTIONS.page.margin).toBe(Margin.NONE);
      expect(DEFAULT_OPTIONS.page.format).toBe("A4");
      expect(DEFAULT_OPTIONS.page.orientation).toBe("portrait");
    });

    test("canvas engine defaults", () => {
      expect(DEFAULT_OPTIONS.canvas.resolution).toBe(Resolution.MEDIUM);
      expect(DEFAULT_OPTIONS.canvas.quality).toBe(0.9);
      expect(DEFAULT_OPTIONS.canvas.mimeType).toBe("image/jpeg");
      expect(DEFAULT_OPTIONS.canvas.align).toBe(Alignment.TOP_LEFT);
      expect(DEFAULT_OPTIONS.canvas.size).toBe(Size.ORIGINAL);
      expect(DEFAULT_OPTIONS.canvas.overrides.useCORS).toBe(true);
      expect(DEFAULT_OPTIONS.canvas.overrides.logging).toBe(false);
    });

    test("html engine defaults", () => {
      expect(DEFAULT_OPTIONS.html.autoPaging).toBe("text");
      expect(DEFAULT_OPTIONS.html.fragmentScale).toBe(2);
    });

    test("method defaults to save", () => {
      expect(DEFAULT_OPTIONS.method).toBe("save");
    });
  });
});
