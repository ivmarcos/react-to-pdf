/**
 * @jest-environment jsdom
 */

import { test, expect } from "@jest/globals";
import { Image } from "../converter/image";

describe("Image", () => {
  test("should return the correct dimensions", () => {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", String(200));
    canvas.setAttribute("height", String(400));
    const image = new Image(canvas, 2);
    expect({
      width: image.getWidth(),
      height: image.getHeight(),
      originalWidth: image.getOriginalWidth(),
      originalHeight: image.getOriginalHeight(),
    }).toEqual({
      width: 200,
      height: 400,
      originalWidth: 100,
      originalHeight: 200,
    });
  });
});
