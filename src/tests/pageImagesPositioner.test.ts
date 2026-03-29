import { describe, expect, test } from "vitest";
import { Image } from "../models/image";
import { TargetImage } from "../types";
import { PageImagesBuilder } from "../services/pageImagesBuilder";
import { createCanvas, createImage } from "./testUtils";
import { PageImagesPositioner } from "../services/pageImagesPositioner";
import { Document } from "../models/document";
import { parseOptions } from "../services/documentConverter";
import { Alignment } from "../constants";
import { Page } from "../models/page";
import * as utils from "../utils";

describe("PageImagesPositioner", () => {
  describe("calculateCoordinatesPageImages - TOP_LEFT", () => {
    test("should position images at top-left with margin offsets", () => {
      const image1 = createImage(200, 300);
      const image2 = createImage(200, 500);
      const page = new Page({ number: 1, height: 1000 });
      page.addImage(image1);
      page.addImage(image2);
      const options = parseOptions({
        align: Alignment.TOP_LEFT,
      });
      const document = new Document(options);
      const positioner = new PageImagesPositioner(document, options);
      const imagesWithCoordinates =
        positioner.calculateCoordinatesPageImages(page);
      expect(imagesWithCoordinates[0].x).toBe(0);
      expect(imagesWithCoordinates[0].y).toBe(0);
      expect(imagesWithCoordinates[0].width).toBe(utils.pxToMM(200));
      expect(imagesWithCoordinates[0].height).toBe(utils.pxToMM(300));
      expect(imagesWithCoordinates[1].x).toBe(0);
      expect(imagesWithCoordinates[1].y).toBe(utils.pxToMM(300));
      expect(imagesWithCoordinates[1].width).toBe(utils.pxToMM(200));
      expect(imagesWithCoordinates[1].height).toBe(utils.pxToMM(500));
    });
  });

  describe("calculateCoordinatesPageImages - CENTER_X", () => {
    test("should center x and use margin top + offset for y", () => {
      const image1 = createImage(200, 300);
      const image2 = createImage(200, 500);
      const page = new Page({ number: 1, height: 1000 });
      page.addImage(image1);
      page.addImage(image2);
      const options = parseOptions({
        align: Alignment.CENTER_X,
      });
      const document = new Document(options);
      const positioner = new PageImagesPositioner(document, options);
      const results = positioner.calculateCoordinatesPageImages(page);

      const pageWidth = document.getPageWidth();
      const imgWidth1 = utils.pxToMM(200);
      const marginTop = document.getMarginTop();

      expect(results[0].x).toBe(pageWidth / 2 - imgWidth1 / 2);
      expect(results[0].y).toBe(marginTop + 0);
      expect(results[1].x).toBe(pageWidth / 2 - imgWidth1 / 2);
      expect(results[1].y).toBe(marginTop + utils.pxToMM(300));
    });
  });

  describe("calculateCoordinatesPageImages - CENTER_Y", () => {
    test("should use margin left for x and center y for single page", () => {
      const image1 = createImage(200, 300);
      const page = new Page({ number: 1, height: 1000 });
      page.addImage(image1);
      const options = parseOptions({
        align: Alignment.CENTER_Y,
      });
      const document = new Document(options);
      const positioner = new PageImagesPositioner(document, options);
      const results = positioner.calculateCoordinatesPageImages(page);

      const pageHeight = document.getPageHeight();
      const contentHeight = page.getContentHeight();
      const marginLeft = document.getMarginLeft();

      expect(results[0].x).toBe(marginLeft);
      expect(results[0].y).toBe(pageHeight / 2 - contentHeight / 2);
    });

    test("should use margin top for y on multi-page documents", () => {
      const image1 = createImage(200, 300);
      const page = new Page({ number: 1, height: 1000 });
      page.addImage(image1);
      const options = parseOptions({
        align: Alignment.CENTER_Y,
      });
      const document = new Document(options);
      document.addPage();
      const positioner = new PageImagesPositioner(document, options);
      const results = positioner.calculateCoordinatesPageImages(page);

      const marginLeft = document.getMarginLeft();
      const marginTop = document.getMarginTop();

      expect(results[0].x).toBe(marginLeft);
      expect(results[0].y).toBe(marginTop + 0);
    });
  });

  describe("calculateCoordinatesPageImages - CENTER_XY", () => {
    test("should center both x and y based on content height", () => {
      const image1 = createImage(200, 300);
      const image2 = createImage(200, 500);
      const page = new Page({ number: 1, height: 1000 });
      page.addImage(image1);
      page.addImage(image2);
      const options = parseOptions({
        align: Alignment.CENTER_XY,
      });
      const document = new Document(options);
      const positioner = new PageImagesPositioner(document, options);
      const results = positioner.calculateCoordinatesPageImages(page);

      const pageWidth = document.getPageWidth();
      const pageHeight = document.getPageHeight();
      const imgWidth = utils.pxToMM(200);
      const contentHeight = page.getContentHeight();

      expect(results[0].x).toBe(pageWidth / 2 - imgWidth / 2);
      expect(results[0].y).toBe(pageHeight / 2 - contentHeight / 2);
      expect(results[1].x).toBe(pageWidth / 2 - imgWidth / 2);
      expect(results[1].y).toBe(
        pageHeight / 2 - contentHeight / 2 + utils.pxToMM(300)
      );
    });
  });

  describe("calculateCoordinatesBody", () => {
    test("TOP_LEFT - should return margin left and margin top", () => {
      const options = parseOptions({
        align: Alignment.TOP_LEFT,
        page: { margin: 10 },
      });
      const document = new Document(options);
      const positioner = new PageImagesPositioner(document, options);
      const result = positioner.calculateCoordinatesBody(50, 80);

      expect(result.x).toBe(10);
      expect(result.y).toBe(10);
    });

    test("CENTER_X - should center x and use margin top for y", () => {
      const options = parseOptions({
        align: Alignment.CENTER_X,
        page: { margin: 10 },
      });
      const document = new Document(options);
      const positioner = new PageImagesPositioner(document, options);
      const imgWidth = 50;
      const result = positioner.calculateCoordinatesBody(imgWidth, 80);

      expect(result.x).toBe(document.getPageWidth() / 2 - imgWidth / 2);
      expect(result.y).toBe(10);
    });

    test("CENTER_Y - should use margin left and center y for single page", () => {
      const options = parseOptions({
        align: Alignment.CENTER_Y,
        page: { margin: 10 },
      });
      const document = new Document(options);
      const positioner = new PageImagesPositioner(document, options);
      const imgHeight = 80;
      const result = positioner.calculateCoordinatesBody(50, imgHeight);

      expect(result.x).toBe(10);
      expect(result.y).toBe(document.getPageHeight() / 2 - imgHeight / 2);
    });

    test("CENTER_Y - should use margin top for y on multi-page", () => {
      const options = parseOptions({
        align: Alignment.CENTER_Y,
        page: { margin: 10 },
      });
      const document = new Document(options);
      document.addPage();
      const positioner = new PageImagesPositioner(document, options);
      const result = positioner.calculateCoordinatesBody(50, 80);

      expect(result.x).toBe(10);
      expect(result.y).toBe(10);
    });

    test("CENTER_XY - should center both x and y", () => {
      const options = parseOptions({
        align: Alignment.CENTER_XY,
        page: { margin: 10 },
      });
      const document = new Document(options);
      const positioner = new PageImagesPositioner(document, options);
      const imgWidth = 50;
      const imgHeight = 80;
      const result = positioner.calculateCoordinatesBody(imgWidth, imgHeight);

      expect(result.x).toBe(document.getPageWidth() / 2 - imgWidth / 2);
      expect(result.y).toBe(document.getPageHeight() / 2 - imgHeight / 2);
    });
  });

  describe("calculateCoordinatesFooter", () => {
    test("center (default) - should center x and position y from bottom", () => {
      const options = parseOptions({
        footer: { margin: 10, align: "center" },
      });
      const document = new Document(options);
      const positioner = new PageImagesPositioner(document, options);
      const imgWidth = 50;
      const imgHeight = 20;
      const result = positioner.calculateCoordinatesFooter(imgWidth, imgHeight);

      expect(result.x).toBe(document.getPageWidth() / 2 - imgWidth / 2);
      expect(result.y).toBe(document.getPageHeight() - 10 - imgHeight);
    });

    test("left - should position x at margin left", () => {
      const options = parseOptions({
        footer: { margin: 10, align: "left" },
        page: { margin: 5 },
      });
      const document = new Document(options);
      const positioner = new PageImagesPositioner(document, options);
      const imgWidth = 50;
      const imgHeight = 20;
      const result = positioner.calculateCoordinatesFooter(imgWidth, imgHeight);

      expect(result.x).toBe(document.getMarginLeft());
      expect(result.y).toBe(document.getPageHeight() - 10 - imgHeight);
    });

    test("right - should position x at right edge minus margin and width", () => {
      const options = parseOptions({
        footer: { margin: 10, align: "right" },
        page: { margin: 5 },
      });
      const document = new Document(options);
      const positioner = new PageImagesPositioner(document, options);
      const imgWidth = 50;
      const imgHeight = 20;
      const result = positioner.calculateCoordinatesFooter(imgWidth, imgHeight);

      expect(result.x).toBe(
        document.getPageWidth() - document.getMarginRight() - imgWidth
      );
      expect(result.y).toBe(document.getPageHeight() - 10 - imgHeight);
    });
  });

  describe("calculateCoordinatesHeader", () => {
    test("center (default) - should center x and use header margin for y", () => {
      const options = parseOptions({
        header: { margin: 12, align: "center" },
      });
      const document = new Document(options);
      const positioner = new PageImagesPositioner(document, options);
      const imgWidth = 50;
      const result = positioner.calculateCoordinatesHeader(imgWidth);

      expect(result.x).toBe(document.getPageWidth() / 2 - imgWidth / 2);
      expect(result.y).toBe(12);
    });

    test("left - should position x at margin left", () => {
      const options = parseOptions({
        header: { margin: 12, align: "left" },
        page: { margin: 8 },
      });
      const document = new Document(options);
      const positioner = new PageImagesPositioner(document, options);
      const imgWidth = 50;
      const result = positioner.calculateCoordinatesHeader(imgWidth);

      expect(result.x).toBe(document.getMarginLeft());
      expect(result.y).toBe(12);
    });

    test("right - should position x at right edge minus margin and width", () => {
      const options = parseOptions({
        header: { margin: 12, align: "right" },
        page: { margin: 8 },
      });
      const document = new Document(options);
      const positioner = new PageImagesPositioner(document, options);
      const imgWidth = 50;
      const result = positioner.calculateCoordinatesHeader(imgWidth);

      expect(result.x).toBe(
        document.getPageWidth() - document.getMarginRight() - imgWidth
      );
      expect(result.y).toBe(12);
    });
  });
});
