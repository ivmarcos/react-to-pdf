import { describe, expect, test } from "vitest";
import { CanvasConverter } from "../converter/canvasConverter";
import { Size } from "../constants";
import { parseOptions } from "../converter/documentConverter";

describe("CanvasConverter", () => {
  describe("calculaResizeScale", () => {
    test("should correctly return the scale when size option is SHRINK_TO_FIT", () => {
      const options = parseOptions({
        size: Size.SHRINK_TO_FIT,
      });
      const canvasConverter = new CanvasConverter({
        maxHeight: 500,
        maxWidth: 100,
        options,
      });
      const element = document.createElement("div");
      element.style.width = `1000px`;
      expect(canvasConverter.calculateResizeScale(element)).toBe(0.1);
      element.style.width = `99px`;
      expect(canvasConverter.calculateResizeScale(element)).toBe(1);
    });

    test("should correctly return the scale when size option is FILL_PAGE", () => {
      const options = parseOptions({
        size: Size.FILL_PAGE,
      });
      const canvasConverter = new CanvasConverter({
        maxHeight: 500,
        maxWidth: 100,
        options,
      });
      const element = document.createElement("div");
      element.style.width = `1000px`;
      expect(canvasConverter.calculateResizeScale(element)).toBe(0.1);
      element.style.width = `50px`;
      expect(canvasConverter.calculateResizeScale(element)).toBe(2);
    });

    test("should correctly return the scale when size option is ORIGINAL", () => {
      const options = parseOptions({
        size: Size.ORIGINAL,
      });
      const canvasConverter = new CanvasConverter({
        maxHeight: 500,
        maxWidth: 100,
        options,
      });
      const element = document.createElement("div");
      element.style.width = `1000px`;
      expect(canvasConverter.calculateResizeScale(element)).toBe(1);
      element.style.width = `99px`;
      expect(canvasConverter.calculateResizeScale(element)).toBe(1);
    });
  });
});
