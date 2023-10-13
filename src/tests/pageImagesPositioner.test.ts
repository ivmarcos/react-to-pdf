/**
 * @jest-environment jsdom
 */

import { expect, test } from "@jest/globals";
import { Image } from "../converter/image";
import { TargetImage } from "../types";
import { PageImagesBuilder } from "../converter/pageImagesBuilder";
import { createCanvas, createImage } from "./testUtils";
import { PageImagesPositioner } from "../converter/pageImagesPositioner";
import { Document } from "../converter/document";
import { parseOptions } from "../converter/documentConverter";
import { Alignment } from "../constants";
import { Page } from "../converter/page";
import * as utils from '../utils';

describe("PageImagesBuilder", () => {
  test("should work", () => {
    const image1 = createImage(200, 300)
    const image2 = createImage(200, 500)
    const page = new Page({number: 1, height: 1000})
    page.addImage(image1)
    page.addImage(image2)
    const options = parseOptions({
      align: Alignment.TOP_LEFT
    })
    const document = new Document(parseOptions({
      align: Alignment.TOP_LEFT
    }))
    const positioner = new PageImagesPositioner(document, options);
    const imagesWithCoordinates = positioner.calculateCoordinatesPageImages(page);
    expect(imagesWithCoordinates[0].x).toBe(0)
    expect(imagesWithCoordinates[0].y).toBe(0)
    expect(imagesWithCoordinates[0].width).toBe(utils.pxToMM(200));
    expect(imagesWithCoordinates[0].height).toBe(utils.pxToMM(300))
    expect(imagesWithCoordinates[1].x).toBe(0)
    expect(imagesWithCoordinates[1].y).toBe(utils.pxToMM(300))
    expect(imagesWithCoordinates[1].width).toBe(utils.pxToMM(200));
    expect(imagesWithCoordinates[1].height).toBe(utils.pxToMM(500))
  });
});
