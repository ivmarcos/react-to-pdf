/**
 * @jest-environment jsdom
 */

import { expect, test } from "@jest/globals";
import { Page } from "../converter/page";
import { createImage } from "./testUtils";

describe("Page", () => {
  test("should work", () => {
    const image1 = createImage(100, 100);
    const image2 = createImage(100, 150);
    const page = new Page({number: 1, height: 300});
    page.addImage(image1);
    page.addImage(image2);
    expect(page.getImages().length).toBe(2);
    expect(page.getAvailableHeight()).toBe(50);
    expect(page.getImageY(image1)).toBe(0)
    expect(page.getImageY(image2)).toBe(100)
    expect(page.isFull()).toBe(false)
  });

});
