/**
 * @jest-environment jsdom
 */

import { test, expect } from "@jest/globals";
import * as utils from "./utils";
import { Image } from "./image";
import {
  PageImagesBuilder,
  TargetImage,
  parseOptions,
} from "./documentConverter";
import { Document } from "./document";

describe.only("PageImagesBuilder", () => {
  test.only("should work", () => {
    const targetImages: TargetImage[] = [];
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", String(200));
    canvas.setAttribute("height", String(1500));
    const targetImage1: TargetImage = {
      image: new Image(canvas, 1),
      options: { startOnNewPage: false },
    };
    const targetImage2: TargetImage = {
      image: new Image(canvas, 1),
      options: { startOnNewPage: true },
    };
    targetImages.push(targetImage1);
    targetImages.push(targetImage2);
    const builder = new PageImagesBuilder(targetImages, 1000);
    const pages = builder.createPages();
    expect(pages.length).toBe(1);
  });
});
