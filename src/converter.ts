import html2canvas from "html2canvas";
import jsPDF, { Html2CanvasOptions } from "jspdf";
import { MM_TO_PX } from "./constants";
import { ConversionOptions, Options } from "./types";


const FILL_PAGE = 'true';
const VERTICALLY_CENTERED = 'true';

import { DEFAULT_OPTIONS } from "./constants";
import { over } from "cypress/types/lodash";
import { mmToPX, pxToMM } from "./utils";

export const parseConversionOptions = (options?: Options): ConversionOptions => {
  if (!options) {
    return DEFAULT_OPTIONS;
  }
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    canvas: { ...DEFAULT_OPTIONS.canvas, ...options.canvas },
    page: { ...DEFAULT_OPTIONS.page, ...options.page },
  };
};

export class DocumentConverter {
  options: ConversionOptions;
  constructor(options?: Options) {
    this.options = parseConversionOptions(options);

  }
  calculateHorizontalFitScale(elementWidth: number, maxWidth: number){
    if (elementWidth > maxWidth){
      return elementWidth / maxWidth;
    }
    return 1;
  }
  getResolution(){
    return this.options.resolution;
  }

  calculateNumberOfPages(element: HTMLElement){
    const document = new Document(this.options);
    const documentMaxHeight = mmToPX(document.getPageMaxHeight());
    const documentMaxWidth = mmToPX(document.getPageMaxWidth());
    const elementHeight = element.offsetHeight;
    const elementWidth = element.offsetWidth;
    const resizeFitRatio = CanvasUtils.calculateFitRatio({size: elementWidth, maxSize: documentMaxWidth})
    console.log('CALCULATE NUMBER OF PAGES', elementHeight, element.style.height, documentMaxHeight, resizeFitRatio)

    const elementHeightResizedToFit = elementHeight * resizeFitRatio;
    return Math.ceil(elementHeightResizedToFit / documentMaxHeight )
   }
 
  calculateX(document: InstanceType<typeof Document>, imageWidth: number) {
    switch (true) {
      // case VERTICALLY_CENTERED:
      //   return document.getPageWidth() / 2 - imageWidth / 2;
      default:
        return document.getMarginLeft();
    }
  }
  calculateY(document: InstanceType<typeof Document>, imageHeight: number) {
    switch (true) {
      // case VERTICALLY_CENTERED:
      //   return document.getPageHeight() / 2 - imageHeight / 2;
      default:
        return document.getMarginTop();
    }
  }
  async convert(element: HTMLElement): Promise<InstanceType<typeof Document>> {
    const document = new Document(this.options);
    const documentMaxHeight = mmToPX(document.getPageMaxHeight());
    const documentMaxWidth = mmToPX(document.getPageMaxWidth());
    const canvasConverter = new CanvasConverter({maxHeight: documentMaxHeight, maxWidth: documentMaxWidth, options: this.options} );
    const images = await canvasConverter.htmlToCanvasImages(element);
    console.log('debug images', images)
    images.forEach((image, pageIndex) => {
      if (pageIndex) {
        document.addPage();
      }
      const width = pxToMM(image.getOriginalWidth());
      const height = pxToMM(image.getOriginalHeight());
      const x = this.calculateX(document, width);
      const y = this.calculateY(document, height);
      console.log('DEBUG ADD CANVAS TO PAGE', JSON.stringify({width, height, x, y, documentMaxHeight, documentMaxWidth}, null, 2))
      const page = pageIndex + 1;
      document.addCanvasToPage({ canvas: image.getCanvas(), page, width, height, x, y });
    });
    return document;
  }
  async createDocument({bodyElement, footerElements, headerElements}: {bodyElement: HTMLElement, footerElements: HTMLElement[], headerElements: HTMLElement[]}): Promise<InstanceType<typeof Document>> {
    const document = new Document(this.options);
    const documentMaxHeight = mmToPX(document.getPageMaxHeight());
    const documentMaxWidth = mmToPX(document.getPageMaxWidth());
    console.log('DEBUG CREATE DOCUMENT CONVERTER', bodyElement.offsetHeight)
    const canvasConverter = new CanvasConverter({maxHeight: documentMaxHeight, maxWidth: documentMaxWidth, options: this.options} );
    const bodyImages = await canvasConverter.htmlToCanvasImages(bodyElement);
    const footerCanvases = await Promise.all(footerElements.map(footerElement => canvasConverter.htmlToCanvas(footerElement, this.options.resolution)));
    bodyImages.forEach((bodyImage, pageIndex) => {
      if (pageIndex) {
        document.addPage();
      }
      const width = pxToMM(bodyImage.getOriginalWidth());
      const height = pxToMM(bodyImage.getOriginalHeight());
      const x = this.calculateX(document, width);
      const y = this.calculateY(document, height);
      console.log('DEBUG ADD CANVAS TO PAGE', JSON.stringify({width, height, x, y, documentMaxHeight, documentMaxWidth}, null, 2))
      const page = pageIndex + 1;
      document.addCanvasToPage({ canvas: bodyImage.getCanvas(), page, width, height, x, y });
      const footerCanvas = footerCanvases[pageIndex];
      if (footerCanvas) document.addCanvasToPage({ canvas: footerCanvas, page, width: footerCanvas.width / this.options.resolution, height: footerCanvas.height / this.options.resolution, x: 5, y: 5 });
    });
    return document;
  }
}

export class Document {
  options: ConversionOptions;
  instance: InstanceType<typeof jsPDF>;
  constructor(options: ConversionOptions) {
    this.options = options;
    this.instance = new jsPDF({
      format: this.options.page.format,
      orientation: this.options.page.orientation,
      ...this.options.overrides?.pdf,
      unit: "mm",
    });
  }

  addPage() {
    this.instance.addPage(
      this.options.page.format,
      this.options.page.orientation
    );
  }

  getNumberOfPages(){
    return this.instance.getNumberOfPages();
  }

  addCanvasToPage({
    canvas,
    page = 1,
    width,
    height,
    x,
    y,
  }: {
    canvas: HTMLCanvasElement;
    page: number;
    width: number;
    height: number;
    x: number;
    y: number;
  }) {
    const imageData = canvas.toDataURL(
      this.options.canvas.mimeType,
      this.options.canvas.qualityRatio
    );
    this.instance.setPage(page);
    this.instance.addImage({
      imageData,
      width,
      height,
      x,
      y,
    });
  }
  async save(filename?: string) {
    return this.instance.save(
      filename ?? this.options.filename ?? `${new Date().getTime()}.pdf`,
      { returnPromise: true }
    );
  }
  open() {
    window.open(this.instance.output("bloburl"), "_blank");
  }
  getBlob() {
    return new Blob([this.instance.output("blob")]);
  }
  getBlobURL(){
    return this.instance.output("bloburl")
  }
  getPageMaxWidth() {
    return this.getPageWidth() - (this.getMarginLeft() + this.getMarginRight());
  }
  getPageMaxHeight() {
    return (
      this.getPageHeight() - (this.getMarginTop() + this.getMarginBottom())
    );
  }
  getPageHeight() {
    return this.instance.internal.pageSize.height;
  }
  getPageWidth() {
    return this.instance.internal.pageSize.width;
  }
  getMarginTop() {
    const margin =
      typeof this.options.page.margin === "object"
        ? this.options.page.margin.top
        : this.options.page.margin;
    return Number(margin);
  }
  getMarginLeft() {
    const margin =
      typeof this.options.page.margin === "object"
        ? this.options.page.margin.left
        : this.options.page.margin;
    return Number(margin);
  }
  getMarginRight() {
    const margin =
      typeof this.options.page.margin === "object"
        ? this.options.page.margin.right
        : this.options.page.margin;
    return Number(margin);
  }
  getMarginBottom() {
    const margin =
      typeof this.options.page.margin === "object"
        ? this.options.page.margin.bottom
        : this.options.page.margin;
    return Number(margin);
  }
  getInstance() {
    return this.instance;
  }
}

class CanvasUtils {
  static cropY({
    width,
    height,
    offsetY,
    canvas,
  }: {
    width: number;
    height: number;
    offsetY: number;
    canvas: HTMLCanvasElement;
  }): HTMLCanvasElement {
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.setAttribute("width", String(width));
    croppedCanvas.setAttribute("height", String(height));
    const ctx = croppedCanvas.getContext("2d");
    ctx.drawImage(
      canvas,
      0,
      offsetY,
      canvas.width,
      height,
      0,
      0,
      canvas.width,
      height
    );
    return croppedCanvas;
  }
  static calculateHeightOffset({ maxHeight, height, offsetY }): number {
    if (height < maxHeight || height - offsetY < maxHeight) {
      return height;
    }
    return maxHeight;
  }
  static calculateFitRatio({maxSize, size}: {maxSize: number, size: number}){
    if (size > maxSize){
      return size / maxSize;
    }
    return 1;
  }
}


class Image {
  scale: number;
  canvas: HTMLCanvasElement;
  constructor(canvas: HTMLCanvasElement, scale: number){
    this.canvas = canvas;
    this.scale = scale;
  }
  getCanvas(){
    return this.canvas;
  }
  getWidth(){
    return this.canvas.width
  }
  getHeight(){
    return this.canvas.height
  }
  getOriginalWidth(){
    return this.getWidth() / this.scale;
  }
  getOriginalHeight(){
    return this.getHeight() / this.scale;
  }
}
class CanvasConverter {
  maxWidth: number;
  maxHeight: number;
  options: ConversionOptions

  constructor(
    { maxHeight, maxWidth, options }: {
      maxHeight: number,
      maxWidth: number,
      options: ConversionOptions
    },
  ) {
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;
    this.options = options;
  }

  async htmlToCanvas(element: HTMLElement, scale: number): Promise<HTMLCanvasElement> {
    return html2canvas(element, {
      scale,
      ...this.options.canvas,
      ...this.options.overrides.canvas,
      logging: true
    });
  }

  calculateScale(element: HTMLElement) {
    switch (FILL_PAGE) {
      // case 'true': {
      //   const elementWidth = element.offsetWidth;
      //   const fitFactor = elementWidth / maxWidth;
      //   return this.options.resolution * (fitFactor < 1 ? fitFactor + 1: fitFactor);
      // }
      default:
        return this.options.resolution * CanvasUtils.calculateFitRatio({size: element.offsetWidth, maxSize: this.maxWidth});
    }
  }
  calculateMaxHeight(canvas: HTMLCanvasElement, scale){
    const originalCanvasWidth = canvas.width / scale;
    if (originalCanvasWidth > this.maxWidth){
      const resizeFitRatio = CanvasUtils.calculateFitRatio({size: originalCanvasWidth, maxSize: this.maxWidth})
      return this.maxHeight * resizeFitRatio * scale;
    }
    return this.maxHeight * scale;
  }

  
  async htmlToCanvasImages(element: HTMLElement): Promise<InstanceType<typeof Image>[]> {
    const scale = this.calculateScale(element);
    console.log('DEBUG BEFORE CONVERTING TO CANVAS', element.offsetHeight)
    const canvas = await this.htmlToCanvas(element, scale);
    console.log('DEBUG AFTER CONVERTING TO CANVAS', element.offsetHeight)
    const canvasMaxHeight = this.calculateMaxHeight(canvas, scale)
    const numberImages = Math.ceil(canvas.height / canvasMaxHeight);
    console.log('DEBUG converting to images', JSON.stringify({elementWidth: element.offsetWidth, elementHeight: element.offsetHeight, scale, canvasWidth: canvas.width, canvasOriginalHeight: canvas.height / scale, canvasHeight: canvas.height, documentMaxWidth: this.maxWidth, canvasMaxHeight}, null, 2))
    return Array(numberImages)
      .fill(null)
      .map((_, pageIndex) => {
        const width = canvas.width;
        const offsetY = canvasMaxHeight * pageIndex;
        const height = CanvasUtils.calculateHeightOffset({
          maxHeight: canvasMaxHeight,
          height: canvas.height,
          offsetY,
        });
        const croppedCanvas = CanvasUtils.cropY({ width, height, offsetY, canvas });
        return new Image(croppedCanvas, scale);
      });
  }
}

export default class OldConverter {
  pdf: InstanceType<typeof jsPDF>;
  canvas: HTMLCanvasElement;
  options: ConversionOptions;
  constructor(canvas: HTMLCanvasElement, options: ConversionOptions) {
    this.canvas = canvas;
    this.options = options;
    this.pdf = new jsPDF({
      format: this.options.page.format,
      orientation: this.options.page.orientation,
      ...this.options.overrides?.pdf,
      unit: "mm",
    });
  }
  getMarginTopMM() {
    const margin =
      typeof this.options.page.margin === "object"
        ? this.options.page.margin.top
        : this.options.page.margin;
    return Number(margin);
  }
  getMarginLeftMM() {
    const margin =
      typeof this.options.page.margin === "object"
        ? this.options.page.margin.left
        : this.options.page.margin;
    return Number(margin);
  }
  getMarginRightMM() {
    const margin =
      typeof this.options.page.margin === "object"
        ? this.options.page.margin.right
        : this.options.page.margin;
    return Number(margin);
  }
  getMarginBottomMM() {
    const margin =
      typeof this.options.page.margin === "object"
        ? this.options.page.margin.bottom
        : this.options.page.margin;
    return Number(margin);
  }
  getMarginTop() {
    return this.getMarginTopMM() * MM_TO_PX;
  }
  getMarginBottom() {
    return this.getMarginBottomMM() * MM_TO_PX;
  }
  getMarginLeft() {
    return this.getMarginLeftMM() * MM_TO_PX;
  }
  getMarginRight() {
    return this.getMarginRightMM() * MM_TO_PX;
  }
  getScale() {
    return this.options.resolution;
  }
  getPageHeight() {
    return this.getPageHeightMM() * MM_TO_PX;
  }
  getPageHeightMM() {
    return this.pdf.internal.pageSize.height;
  }
  getPageWidthMM() {
    return this.pdf.internal.pageSize.width;
  }
  getPageWidth() {
    return this.getPageWidthMM() * MM_TO_PX;
  }
  getOriginalCanvasWidth() {
    return this.canvas.width / this.getScale();
  }
  getOriginalCanvasHeight() {
    return this.canvas.height / this.getScale();
  }
  getCanvasPageAvailableHeight() {
    return (
      this.getPageAvailableHeight() *
      this.getScale() *
      this.getHorizontalFitFactor()
    );
  }
  getPageAvailableWidth() {
    return this.getPageWidth() - (this.getMarginLeft() + this.getMarginRight());
  }
  getPageAvailableHeight() {
    return (
      this.getPageHeight() - (this.getMarginTop() + this.getMarginBottom())
    );
  }
  getPageAvailableWidthMM() {
    return this.getPageAvailableWidth() / MM_TO_PX;
  }
  getPageAvailableHeightMM() {
    return this.getPageAvailableHeight() / MM_TO_PX;
  }
  getNumberPages() {
    return Math.ceil(this.canvas.height / this.getCanvasPageAvailableHeight());
  }
  getHorizontalFitFactor() {
    if (this.getPageAvailableWidth() < this.getOriginalCanvasWidth()) {
      return this.getOriginalCanvasWidth() / this.getPageAvailableWidth();
    }
    return 1;
  }
  getCanvasOffsetY(pageNumber: number) {
    return this.getCanvasPageAvailableHeight() * (pageNumber - 1);
  }
  getCanvasHeightLeft(pageNumber: number) {
    return this.canvas.height - this.getCanvasOffsetY(pageNumber);
  }
  getCanvasPageHeight(pageNumber: number) {
    if (this.canvas.height < this.getCanvasPageAvailableHeight()) {
      return this.canvas.height;
    }
    const canvasHeightPending = this.getCanvasHeightLeft(pageNumber);
    return canvasHeightPending < this.getCanvasPageAvailableHeight()
      ? canvasHeightPending
      : this.getCanvasPageAvailableHeight();
  }
  getCanvasPageWidth() {
    return this.canvas.width;
  }
  createCanvasPage(pageNumber: number): HTMLCanvasElement {
    const canvasPageWidth = this.getCanvasPageWidth();
    const canvasPageHeight = this.getCanvasPageHeight(pageNumber);
    const canvasPage = document.createElement("canvas");
    canvasPage.setAttribute("width", String(canvasPageWidth));
    canvasPage.setAttribute("height", String(canvasPageHeight));
    const ctx = canvasPage.getContext("2d");
    ctx.drawImage(
      this.canvas,
      0,
      this.getCanvasOffsetY(pageNumber),
      this.canvas.width,
      canvasPageHeight,
      0,
      0,
      this.canvas.width,
      canvasPageHeight
    );
    return canvasPage;
  }
  convert(): InstanceType<typeof jsPDF> {
    let pageNumber = 1;
    const numberPages = this.getNumberPages();
    while (pageNumber <= numberPages) {
      if (pageNumber > 1) {
        this.pdf.addPage(
          this.options.page.format,
          this.options.page.orientation
        );
      }
      const canvasPage = this.createCanvasPage(pageNumber);
      const pageImageDataURL = canvasPage.toDataURL(
        this.options.canvas.mimeType,
        this.options.canvas.qualityRatio
      );
      this.pdf.setPage(pageNumber);
      this.pdf.addImage({
        imageData: pageImageDataURL,
        width:
          canvasPage.width /
          (this.getScale() * MM_TO_PX * this.getHorizontalFitFactor()),
        height:
          canvasPage.height /
          (this.getScale() * MM_TO_PX * this.getHorizontalFitFactor()),
        x: this.getMarginLeftMM(),
        y: this.getMarginTopMM(),
      });
      pageNumber += 1;
    }
    return this.pdf;
  }
}
