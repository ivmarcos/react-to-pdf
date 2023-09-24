/**
 * @jest-environment jsdom
 */

import { expect, test } from "@jest/globals";
import { Image } from "./image";
import { TargetImage } from "./types";
import { PageImagesBuilder } from "./pageImagesBuilder";

const createCanvas = (width:number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", String(width));
  canvas.setAttribute("height", String(height));
  return canvas;
}

describe("PageImagesBuilder", () => {
  test("should work", () => {
    const targetImages: TargetImage[] = [];
    const targetImage1: TargetImage = {
      image: new Image(createCanvas(100, 1500), 1),
      options: { startOnNewPage: false },
    };
    const targetImage2: TargetImage = {
      image: new Image(createCanvas(200, 1500), 1),
      options: { startOnNewPage: false },
    };
    targetImages.push(targetImage1);
    targetImages.push(targetImage2);
    const builder = new PageImagesBuilder(targetImages, 1000);
    const pages = builder.createPages();
    expect(pages.length).toBe(3);
    expect(pages[0].getImages().length).toBe(1);
    expect(pages[1].getImages().length).toBe(2);
    expect(pages[1].getImages()[0].getHeight()).toBe(500);
    expect(pages[1].getImages()[1].getHeight()).toBe(500);
    expect(pages[2].getImages().length).toBe(1);
    expect(pages[2].getImages()[0].getHeight()).toBe(1000);

  });
  test.only("should work2", () => {
    const targetImages: TargetImage[] = [];
    const targetImage1: TargetImage = {
      image: new Image(createCanvas(100, 1000), 1),
      options: { startOnNewPage: false },
    };
    const targetImage2: TargetImage = {
      image: new Image(createCanvas(300, 2000), 1),
      options: { startOnNewPage: false },
    };
    targetImages.push(targetImage1);
    targetImages.push(targetImage2);
    const builder = new PageImagesBuilder(targetImages, 3000);
    const pages = builder.createPages();
    expect(pages.length).toBe(1);
    expect(pages[0].getImages().length).toBe(2);
    expect(pages[0].getImages()[0].getHeight()).toBe(1000);
    expect(pages[0].getImages()[1].getHeight()).toBe(2000);

  });
});
