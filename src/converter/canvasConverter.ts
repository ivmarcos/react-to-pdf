import html2canvas from "html2canvas";
import { DocumentConverterOptions } from "../types";
import { Size } from "../constants";
import * as utils from "../utils";
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
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
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
    element: HTMLElement,
    allowResize?: boolean
  ): Promise<InstanceType<typeof Image>> {
    const displayScale = this.options.resolution;
    const resizeScale = allowResize ? this.calculateResizeScale(element) : 1;
    const canvas = await this.htmlToCanvas(element, displayScale * resizeScale);
    return new Image(canvas, displayScale);
  }

  async htmlToCanvasImages(
    element: HTMLElement,
    allowResize?: boolean
  ): Promise<InstanceType<typeof Image>[]> {
    const displayScale = this.options.resolution;
    const resizeScale = allowResize ? this.calculateResizeScale(element) : 1;
    const canvas = await this.htmlToCanvas(element, displayScale * resizeScale);
    const canvasMaxHeight = this.maxHeight * displayScale;
    const numberImages = Math.ceil(canvas.height / canvasMaxHeight);
    return Array(numberImages)
      .fill(null)
      .map((_, pageIndex) => {
        const width = canvas.width;
        const offsetY = canvasMaxHeight * pageIndex;
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
