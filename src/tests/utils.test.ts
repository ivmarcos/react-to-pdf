import { describe, test, expect } from "vitest";
import * as utils from "../utils";

describe("utils", () => {
  describe("cropY", () => {
    test("crops the source canvas to the requested height", () => {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("width", String(400));
      canvas.setAttribute("height", String(1000));
      const croppedCanvas = utils.cropY({
        width: 400,
        height: 700,
        offsetY: 500,
        canvas,
      });
      expect({
        width: croppedCanvas.width,
        height: croppedCanvas.height,
      }).toEqual({
        width: 400,
        height: 700,
      });
    });
  });

  describe("calculateHeightOffset", () => {
    test("returns the height when it fits under the max", () => {
      expect(
        utils.calculateHeightOffset({
          maxHeight: 1000,
          height: 999,
          offsetY: 300,
        })
      ).toBe(999);
    });
    test("returns the remainder when offset pushes height past the limit", () => {
      expect(
        utils.calculateHeightOffset({
          maxHeight: 1000,
          height: 1200,
          offsetY: 300,
        })
      ).toBe(900);
    });
    test("returns the max height when it still overflows", () => {
      expect(
        utils.calculateHeightOffset({
          maxHeight: 1000,
          height: 3000,
          offsetY: 300,
        })
      ).toBe(1000);
    });
  });

  describe("calculateFitRatio", () => {
    test("returns shrink ratio when size exceeds max", () => {
      expect(utils.calculateFitRatio({ maxSize: 5, size: 10 })).toBe(0.5);
    });
    test("returns 1 when size is under the max", () => {
      expect(utils.calculateFitRatio({ maxSize: 10, size: 10 })).toBe(1);
      expect(utils.calculateFitRatio({ maxSize: 10, size: 9.99 })).toBe(1);
    });
  });

  describe("calculateFillRatio", () => {
    test("scales up to fill target", () => {
      expect(utils.calculateFillRatio({ targetSize: 20, size: 10 })).toBe(2);
    });
    test("scales down to fill target", () => {
      expect(utils.calculateFillRatio({ targetSize: 10, size: 20 })).toBe(0.5);
    });
  });

  describe("canvasDimensionsMM", () => {
    test("converts a scaled canvas to mm", () => {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("width", String(200));
      canvas.setAttribute("height", String(400));
      expect(utils.canvasDimensionsMM(canvas, 3)).toEqual({
        height: 35.27777777773221,
        width: 17.638888888866106,
      });
    });
  });

  describe("mmToPX", () => {
    test("converts mm to px", () => {
      expect(utils.mmToPX(200)).toBe(755.905511812);
    });
  });

  describe("pxToMM", () => {
    test("converts px to mm", () => {
      expect(utils.pxToMM(755.905511812)).toBe(200);
    });
  });
});
