import { Alignment } from "../constants";
import { Document } from "../models/document";
import { Image } from "../models/image";
import { Page } from "../models/page";
import { log } from "../tests/testUtils";
import { DocumentConverterOptions, ImageCoordinates } from "../types";
import * as utils from "../utils";

export class PageImagesPositioner {
  options: DocumentConverterOptions;
  document: InstanceType<typeof Document>;
  constructor(
    document: InstanceType<typeof Document>,
    options: DocumentConverterOptions
  ) {
    this.document = document;
    this.options = options;
  }

  calculateImageCoordinates = (
    imageWidth: number,
    imageHeight: number
  ): ImageCoordinates => {
    const document = this.document;
    switch (this.options.align) {
      case Alignment.CENTER_XY: {
        return {
          x: document.getPageWidth() / 2 - imageWidth / 2,
          y: document.getPageHeight() / 2 - imageHeight / 2,
        };
      }
      case Alignment.CENTER_X: {
        return {
          x: document.getPageWidth() / 2 - imageWidth / 2,
          y: document.getMarginTop(),
        };
      }
      case Alignment.CENTER_Y: {
        if (document.getNumberOfPages() > 1) {
          return {
            x: document.getMarginLeft(),
            y: document.getMarginTop(),
          };
        }
        return {
          x: document.getMarginLeft(),
          y: document.getPageHeight() / 2 - imageHeight / 2,
        };
      }
      default:
        return {
          x: document.getMarginLeft(),
          y: document.getMarginTop(),
        };
    }
  };
  calculateCoordinatesPageImages(
    page: Page
  ): Array<ImageCoordinates & { image: Image; width: number; height: number }> {
    const document = this.document;
    return page.getImages().map((image, imageIndex) => {
      const { width, height } = utils.getImageDimensionsMM(image);
      const imageHeightOffset = utils.pxToMM(page.getImageY(image));
      const regularCoordinates = this.calculateImageCoordinates(width, height);
      log("positioner", {
        imageIndex,
        imageHeightOffset,
        documentMarginTop: document.getMarginTop(),
      });
      const calculateOverrideCoordinates = (): Partial<ImageCoordinates> => {
        switch (this.options.align) {
          case Alignment.CENTER_XY: {
            return {
              y:
                document.getPageHeight() / 2 -
                page.getContentHeight() / 2 +
                imageHeightOffset,
            };
          }
          case Alignment.CENTER_X: {
            return {
              y: document.getMarginTop() + imageHeightOffset,
            };
          }
          case Alignment.CENTER_Y: {
            if (document.getNumberOfPages() > 1) {
              return {
                y: document.getMarginTop() + imageHeightOffset,
              };
            }
            return {
              y:
                document.getPageHeight() / 2 -
                page.getContentHeight() / 2 +
                imageHeightOffset,
            };
          }
          default:
            return {
              y: document.getMarginTop() + imageHeightOffset,
            };
        }
      };
      return {
        ...regularCoordinates,
        ...calculateOverrideCoordinates(),
        width,
        height,
        image,
      };
    });
  }
  calculateCoordinatesBody(
    imageWidth: number,
    imageHeight: number
  ): ImageCoordinates {
    const document = this.document;
    switch (this.options.align) {
      case Alignment.CENTER_XY: {
        return {
          x: document.getPageWidth() / 2 - imageWidth / 2,
          y: document.getPageHeight() / 2 - imageHeight / 2,
        };
      }
      case Alignment.CENTER_X: {
        return {
          x: document.getPageWidth() / 2 - imageWidth / 2,
          y: document.getMarginTop(),
        };
      }
      case Alignment.CENTER_Y: {
        if (document.getNumberOfPages() > 1) {
          return {
            x: document.getMarginLeft(),
            y: document.getMarginTop(),
          };
        }
        return {
          x: document.getMarginLeft(),
          y: document.getPageHeight() / 2 - imageHeight / 2,
        };
      }
      default:
        return {
          x: document.getMarginLeft(),
          y: document.getMarginTop(),
        };
    }
  }
  calculateCoordinatesFooter(
    imageWidth: number,
    imageHeigth: number
  ): ImageCoordinates {
    const document = this.document;
    log("calculateCoordinatesFooter", {
      align: this.options.footer.align,
      imageWidth,
      docPageWidth: document.getPageWidth(),
    });
    const y =
      document.getPageHeight() - this.options.footer.margin - imageHeigth;
    switch (this.options.footer.align) {
      case "right":
        return {
          x: document.getPageWidth() - document.getMarginRight() - imageWidth,
          y,
        };
      case "left":
        return {
          x: document.getMarginLeft(),
          y,
        };
      default:
        return {
          x: document.getPageWidth() / 2 - imageWidth / 2,
          y,
        };
    }
  }
  calculateCoordinatesHeader(imageWidth: number): ImageCoordinates {
    const document = this.document;
    const y = this.options.header.margin;
    switch (this.options.header.align) {
      case "right":
        return {
          x: document.getPageWidth() - document.getMarginRight() - imageWidth,
          y,
        };
      case "left":
        return {
          x: document.getMarginLeft(),
          y,
        };
      default:
        return {
          x: document.getPageWidth() / 2 - imageWidth / 2,
          y,
        };
    }
  }
}
