/**
 * @jest-environment jsdom
 */

import { Margin, Resolution } from "./constants";
import Converter from "./converter";
import { Options } from "./types";
import { buildConvertOptions } from "./utils";

export const createPageSnapshotObject = (
  converter: InstanceType<typeof Converter>,
  pageNumber: number
) => {
  return {
    pageNumber,
    offsetY: converter.getCanvasOffsetY(pageNumber),
    heightLeft: converter.getCanvasHeightLeft(pageNumber),
    pageCanvasHeight: converter.getCanvasPageHeight(pageNumber),
    pageCanvasWidth: converter.getCanvasPageWidth(),
    canvas: {
      height: converter.canvas.height,
      width: converter.canvas.width,
      originalWidth: converter.canvas.width / converter.getScale(),
      originalHeight: converter.canvas.height / converter.getScale(),
    },
    horizontalFitFactor: converter.getHorizontalFitFactor(),
    scale: converter.getScale(),
    pageWidthMM: converter.getPageWidthMM(),
    pageHeightMM: converter.getPageHeightMM(),
    pageWidth: converter.getPageWidth(),
    pageHeight: converter.getPageHeight(),
    availableHeight: converter.getPageAvailableHeight(),
    availableWidth: converter.getPageAvailableWidth(),
    availableHeightScaled:
      converter.getPageAvailableHeight() * converter.getScale(),
    availableWidthScaled:
      converter.getPageAvailableWidth() * converter.getScale(),
    margin: converter.options.page.margin,
    numberPages: converter.getNumberPages(),
  };
};

const defaultCanvasDimensions = {
  width: 2000,
  height: 10000,
};

const setupConverter = (
  options?: Options,
  canvasDimensions = defaultCanvasDimensions
): InstanceType<typeof Converter> => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", String(canvasDimensions.width));
  canvas.setAttribute("height", String(canvasDimensions.height));
  const convertOptions = buildConvertOptions(options);
  return new Converter(canvas, convertOptions);
};

type CanvasDimensions = {
  width: number;
  height: number;
};

const resolutionsTestSet: number[] = Object.keys(Resolution)
  .filter((key) => isNaN(Number(key)))
  .map((key) => Resolution[key]);
const marginsTestTest: number[] = Object.keys(Margin)
  .filter((key) => isNaN(Number(key)))
  .map((key) => Resolution[key]);

const canvasDimensionsTestSet: CanvasDimensions[] = [
  {
    width: 2000,
    height: 10000,
  },
  {
    width: 20000,
    height: 100,
  },
];

const buildTestSet = () => {
  const testSet: [string, Options, CanvasDimensions][] = [];
  for (const resolution of resolutionsTestSet) {
    for (const margin of marginsTestTest) {
      for (const canvasDimensions of canvasDimensionsTestSet) {
        testSet.push([
          `Resolution: ${resolution}, Margin: ${margin}, Dimensions: ${canvasDimensions.height}x${canvasDimensions.width}`,
          {
            resolution,
            page: {
              margin,
            },
          },
          canvasDimensions,
        ]);
      }
    }
  }
  return testSet;
};

const testSet = buildTestSet();

describe("Converter", () => {
  test.each(testSet)("%s", (_, options, canvasDimensions) => {
    buildTestSet();
    const converter = setupConverter(options, canvasDimensions);
    const numberPages = converter.getNumberPages();
    let pageNumber = 1;
    while (pageNumber <= numberPages) {
      expect(createPageSnapshotObject(converter, pageNumber)).toMatchSnapshot();
      pageNumber += 1;
    }
  });
});
