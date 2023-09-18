import html2canvas from "html2canvas";
import { DocumentConverterOptions } from "./types";
import { Size } from "./constants";
import * as utils from "./utils";
import { Image } from "./image";

export class CanvasConverter {
  maxWidth: number;
  maxHeight: number;
  options: DocumentConverterOptions;

  constructor({
    maxHeight,
    maxWidth,
    options,
  }: {
    maxHeight: number;
    maxWidth: number;
    options: DocumentConverterOptions;
  }) {
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;
    this.options = options;
  }

  async htmlToCanvas(
    element: HTMLElement,
    scale: number
  ): Promise<HTMLCanvasElement> {
    return html2canvas(element, {
      scale,
      ...this.options.canvas,
      ...this.options.overrides.canvas,
    });
  }
  calculateResizeScale(element: HTMLElement) {
    switch (this.options.size) {
      case Size.SHRINK_TO_FIT:
        return utils.calculateFitRatio({
          maxSize: this.maxWidth,
          size: element.offsetWidth,
        });
      case Size.FILL_PAGE:
        return utils.calculateFillRatio({
          targetSize: this.maxWidth,
          size: element.offsetWidth,
        });
      default:
        return 1;
    }
  }

  async htmlToCanvasImage(
    element: HTMLElement
  ): Promise<InstanceType<typeof Image>> {
    const scale = this.options.resolution;
    const canvas = await this.htmlToCanvas(element, scale);
    console.log("SIMPLE CANVAS", scale, canvas.width, canvas.height);
    return new Image(canvas, scale);
  }

  async htmlToCanvasImages(
    element: HTMLElement,
    allowResize?: boolean
  ): Promise<InstanceType<typeof Image>[]> {
    const displayScale = this.options.resolution;
    const resizeScale = allowResize ? this.calculateResizeScale(element) : 1;
    console.log("DEBUG BEFORE CONVERTING TO CANVAS", element.offsetHeight);
    console.log("DEBUG SCALES!", { displayScale, resizeScale });
    const canvas = await this.htmlToCanvas(element, displayScale * resizeScale);
    const canvasMaxHeight = this.maxHeight * displayScale; //this.calculateMaxHeight(canvas, scale * fillScale);
    console.log(
      "DEBUG AFTER CONVERTING TO CANVAS",
      canvasMaxHeight,
      element.offsetHeight
    );
    const numberImages = Math.ceil(canvas.height / canvasMaxHeight);
    console.log(
      "DEBUG converting to images",
      JSON.stringify(
        {
          elementWidth: element.offsetWidth,
          elementHeight: element.offsetHeight,
          scale: displayScale,
          canvasWidth: canvas.width,
          canvasHeight: canvas.height,
          documentMaxWidth: this.maxWidth,
          canvasMaxHeight,
        },
        null,
        2
      )
    );
    return Array(numberImages)
      .fill(null)
      .map((_, pageIndex) => {
        const width = canvas.width;
        const offsetY = canvasMaxHeight * pageIndex;
        console.log("DEBUG CROP CANVAS", offsetY, pageIndex + 1);
        const height = utils.calculateHeightOffset({
          maxHeight: canvasMaxHeight,
          height: canvas.height,
          offsetY,
        });
        const croppedCanvas = utils.cropY({
          width,
          height,
          offsetY,
          canvas,
        });
        return new Image(croppedCanvas, displayScale);
      });
  }
}
