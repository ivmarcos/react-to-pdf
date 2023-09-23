/**
 * @jest-environment jsdom
 */

import { test, expect } from "@jest/globals";
import * as utils from "./utils";
import { Image } from "./image";

describe("utils", () => {
  describe("cropY", () => {
    test("should work", () => {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("width", String(400));
      canvas.setAttribute("height", String(1000));
      const croppedCanvas = utils.cropY({
        width: 400,
        height: 700,
        offsetY: 500,
        canvas: canvas,
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
    test("return the height when is less than the max height", () => {
      expect(
        utils.calculateHeightOffset({
          maxHeight: 1000,
          height: 999,
          offsetY: 300,
        })
      ).toBe(999);
    });
    test("return the offset height when is less than the max height", () => {
      expect(
        utils.calculateHeightOffset({
          maxHeight: 1000,
          height: 1200,
          offsetY: 300,
        })
      ).toBe(900);
    });
    test("return the max height when is higher than the offset height", () => {
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
    test("return the correct ratio when the size is greater than the max size", () => {
      expect(utils.calculateFitRatio({ maxSize: 5, size: 10 })).toBe(0.5);
    });
    test("return 1 when the size is less or equal than the max size", () => {
      expect(utils.calculateFitRatio({ maxSize: 10, size: 10 })).toBe(1);
      expect(utils.calculateFitRatio({ maxSize: 10, size: 9.99 })).toBe(1);
    });
  });

  describe("calculateFillRatio", () => {
    test("return the correct ratio when the size is lower than the target size", () => {
      expect(utils.calculateFillRatio({ targetSize: 20, size: 10 })).toBe(2);
    });
    test("return the correct ratio when the size is higher or equal than the target size ", () => {
      expect(utils.calculateFillRatio({ targetSize: 10, size: 20 })).toBe(0.5);
    });
  });

  describe("getImageDimensionsMM", () => {
    test("return the correct dimensions for a image in MM", () => {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("width", String(200));
      canvas.setAttribute("height", String(400));
      const image = new Image(canvas, 3);
      expect(utils.getImageDimensionsMM(image)).toEqual({
        height: 35.27777777773221,
        width: 17.638888888866106,
      });
    });
  });

  describe("mmToPX", () => {
    test("should convert correctly", () => {
      expect(utils.mmToPX(200)).toBe(755.905511812);
    });
  });

  describe("pxToMM", () => {
    test("should convert correctly", () => {
      expect(utils.pxToMM(755.905511812)).toBe(200);
    });
  });
});
