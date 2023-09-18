import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PDFOptions, Options, DocumentConverterOptions, PDFProps, FooterHeaderOptions } from "./types";

import { DEFAULT_OPTIONS, Position, Size } from "./constants";
import { mmToPX, pxToMM } from "./utils";

interface DocumentConverterPartialOptions extends Omit<Partial<DocumentConverterOptions>, "footer"|  "header"> {
  footer?: Partial<FooterHeaderOptions>,
  header?: Partial<FooterHeaderOptions>
}

export const parseOptions = (
  options?: DocumentConverterPartialOptions,
): DocumentConverterOptions => {
  if (!options) {
    return DEFAULT_OPTIONS;
  }
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    canvas: { ...DEFAULT_OPTIONS.canvas, ...options.canvas },
    page: { ...DEFAULT_OPTIONS.page, ...options.page },
    footer: {
      ...DEFAULT_OPTIONS.footer,
      ...options?.footer
    },
    header: {
      ...DEFAULT_OPTIONS.header,
      ...options?.header
    }
  };
};

interface ImageCoordinates {
  x: number;
  y: number;
}

export class DocumentConverter {
  options: DocumentConverterOptions;
  constructor(options?: DocumentConverterPartialOptions) {
    this.options = parseOptions(options);
  }
  calculateHorizontalFitScale(elementWidth: number, maxWidth: number) {
    if (elementWidth > maxWidth) {
      return elementWidth / maxWidth;
    }
    return 1;
  }
  getResolution() {
    return this.options.resolution;
  }

  calculateNumberOfPages(element: HTMLElement) {
    const document = new Document(this.options);
    const documentMaxHeight = mmToPX(document.getPageMaxHeight());
    const documentMaxWidth = mmToPX(document.getPageMaxWidth());
    const elementHeight = element.offsetHeight;
    const elementWidth = element.offsetWidth;
    const resizeFitRatio = CanvasUtils.calculateFitRatio({
      size: elementWidth,
      maxSize: documentMaxWidth,
    });
    console.log(
      "CALCULATE NUMBER OF PAGES",
      elementHeight,
      element.style.height,
      documentMaxHeight,
      resizeFitRatio
    );

    const elementHeightResizedToFit = elementHeight * resizeFitRatio;
    return Math.ceil(elementHeightResizedToFit / documentMaxHeight);
  }

  getImageDimensionsMM(image: InstanceType<typeof Image>) {
    return {
      width: pxToMM(image.getOriginalWidth()),
      height: pxToMM(image.getOriginalHeight()),
    };
  }
  calculateCoordinatesBody(
    document: InstanceType<typeof Document>,
    imageWidth: number,
    imageHeight: number
  ): ImageCoordinates {
    switch (this.options.position) {
      case Position.CENTERED_XY_AXIS: {
        return {
          x: document.getPageWidth() / 2 - imageWidth / 2,
          y: document.getPageHeight() / 2 - imageHeight / 2,
        };
      }
      case Position.CENTERED_X_AXIS: {
        return {
          x: document.getPageWidth() / 2 - imageWidth / 2,
          y: document.getMarginTop(),
        };
      }
      case Position.CENTERED_Y_AXIS: {
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
    document: InstanceType<typeof Document>,
    imageWidth: number,
    imageHeigth: number
  ): ImageCoordinates {
    console.log(
      "DEBUG FOOTER image width",
      imageWidth,
      document.getPageWidth()
    );
    const y = document.getPageHeight() - this.options.footer.margin - imageHeigth;
    switch (this.options.footer?.position) {
      case 'right':
        return {
          x: document.getPageWidth() - document.getMarginRight() - imageWidth,
          y,
        };
      case 'left':
        return {
          x: document.getMarginLeft(),
          y,
        };
      default:
        return {
          x: document.getPageWidth() / 2 - imageWidth / 2,
          y
        };
      }
  }
  calculateCoordinatesHeader(
    document: InstanceType<typeof Document>,
    imageWidth: number,
    imageHeigth: number
  ): ImageCoordinates {
    const y = this.options.header.margin;
    switch (this.options.header.position) {
      case 'right':
        return {
          x: document.getPageWidth() - document.getMarginRight() - imageWidth,
          y,
        };
      case 'left':
        return {
          x: document.getMarginLeft(),
          y,
        };
      default:
        return {
          x: document.getPageWidth() / 2 - imageWidth / 2,
          y
        };
    }
  }
  async createDocument(element: HTMLElement): Promise<InstanceType<typeof Document>> {
    const document = new Document(this.options);
    const documentMaxHeight = mmToPX(document.getPageMaxHeight());
    const documentMaxWidth = mmToPX(document.getPageMaxWidth());
    const canvasConverter = new CanvasConverter({
      maxHeight: documentMaxHeight,
      maxWidth: documentMaxWidth,
      options: this.options,
    });
    const images = await canvasConverter.htmlToCanvasImages(element, true);
    console.log("debug images", images);
    images.forEach((image, pageIndex) => {
      if (pageIndex) {
        document.addPage();
      }
      const { width, height } = this.getImageDimensionsMM(image);
      const { x, y } = this.calculateCoordinatesBody(document, width, height);
      console.log(
        "DEBUG ADD CANVAS TO PAGE",
        JSON.stringify(
          { width, height, x, y, documentMaxHeight, documentMaxWidth },
          null,
          2
        )
      );
      const page = pageIndex + 1;
      document.addCanvasToPage({
        canvas: image.getCanvas(),
        page,
        width,
        height,
        x,
        y,
      });
    });
    return document;
  }
  async addFooterAndHeaderToDocument({
    document,
    footerElements = [],
    headerElements = [],
  }: {
    document: InstanceType<typeof Document>;
    footerElements: HTMLElement[];
    headerElements: HTMLElement[];
  }): Promise<InstanceType<typeof Document>> {
    const documentMaxHeight = mmToPX(document.getPageMaxHeight());
    const documentMaxWidth = mmToPX(document.getPageMaxWidth());
    const canvasConverter = new CanvasConverter({
      maxHeight: documentMaxHeight,
      maxWidth: documentMaxWidth,
      options: this.options,
    });
    const [footerImages, headerImages] = await Promise.all(
      [footerElements, headerElements].map((elements) =>
        Promise.all(
          elements.map((element) =>
            element ? canvasConverter.htmlToCanvasImage(element) : null
          )
        )
      )
    );
    const numberOfPages = document.getNumberOfPages();
    let pageIndex = 0;
    while (pageIndex < numberOfPages) {
      const page = pageIndex + 1;
      const footerImage = footerImages[pageIndex];
      const headerImage = headerImages[pageIndex];
      if (footerImage) {
        const { width, height } = this.getImageDimensionsMM(footerImage);
        const footerXY = this.calculateCoordinatesFooter(
          document,
          width,
          height
        );
        console.log("debug ADDING FOOTER IMAGE", footerXY, width, height);
        document.addCanvasToPage({
          canvas: footerImage.getCanvas(),
          page,
          width,
          height,
          ...footerXY,
        });
      }
      if (headerImage) {
        const { width, height } = this.getImageDimensionsMM(headerImage);
        const headerXY = this.calculateCoordinatesHeader(
          document,
          width,
          height
        );
        console.log("debug ADDING HEADER IMAGE", headerXY);
        document.addCanvasToPage({
          canvas: headerImage.getCanvas(),
          page,
          width,
          height,
          ...headerXY,
        });
      }
      pageIndex++;
    }
    return document;
  }
}

export class Document {
  options: DocumentConverterOptions;
  instance: InstanceType<typeof jsPDF>;
  constructor(options: DocumentConverterOptions) {
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

  getNumberOfPages() {
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
  getBlobURL() {
    return this.instance.output("bloburl");
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
    if (height < maxHeight) {
      return height;
    }
    if (height - offsetY < maxHeight){
      return height - offsetY;
    }
    return maxHeight;
  }
  static calculateFitRatio({
    maxSize,
    size,
  }: {
    maxSize: number;
    size: number;
  }) {
    if (size > maxSize) {
      return maxSize / size;
    }
    return 1;
  }
  static calculateFillRatio({
    targetSize,
    size,
  }: {
    targetSize: number;
    size: number;
  }) {
    console.log('DEBUG FILL RATIO', {targetSize, size})
    if (size < targetSize) {
      return targetSize / size;
    }
    return size / targetSize;
  }
}

class Image {
  scale: number;
  canvas: HTMLCanvasElement;
  constructor(canvas: HTMLCanvasElement, scale: number) {
    this.canvas = canvas;
    this.scale = scale;
  }
  getCanvas() {
    return this.canvas;
  }
  getWidth() {
    return this.canvas.width;
  }
  getHeight() {
    return this.canvas.height;
  }
  getOriginalWidth() {
    return this.getWidth() / this.scale;
  }
  getOriginalHeight() {
    return this.getHeight() / this.scale;
  }
}
class CanvasConverter {
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
      logging: true,
    });
  }
  calculateDisplayScale(element: HTMLElement){
    switch (this.options.size){
      // case Size.SHRINK_TO_FIT: {
      //   const fitRatio = CanvasUtils.calculateFitRatio({maxSize: this.maxWidth, size: element.offsetWidth});
      //   console.log('SHRINK TO FIT!', {maxSize: this.maxWidth, size: element.offsetWidth, fitRatio})
      //   return this.options.resolution * fitRatio;
      // }
      default:
         return this.options.resolution;
    }
  }
  calculateResizeScale(element: HTMLElement) {
    switch (this.options.size){
      case Size.SHRINK_TO_FIT: 
        return CanvasUtils.calculateFitRatio({maxSize: this.maxWidth, size: element.offsetWidth});
      case Size.FILL_PAGE:
        return CanvasUtils.calculateFillRatio({targetSize: this.maxWidth, size: element.offsetWidth})
      default: 
        return 1;
    }
  }

  async htmlToCanvasImage(
    element: HTMLElement
  ): Promise<InstanceType<typeof Image>> {
    const scale = this.calculateDisplayScale(element);
    const canvas = await this.htmlToCanvas(element, scale);
    console.log("SIMPLE CANVAS", scale, canvas.width, canvas.height);
    return new Image(canvas, scale);
  }

  async htmlToCanvasImages(
    element: HTMLElement,
    allowResize?: boolean
  ): Promise<InstanceType<typeof Image>[]> {
    const displayScale = this.calculateDisplayScale(element);
    const resizeScale = allowResize ? this.calculateResizeScale(element) : 1;
    console.log("DEBUG BEFORE CONVERTING TO CANVAS", element.offsetHeight);
    console.log("DEBUG SCALES!", {displayScale, resizeScale});
    const canvas = await this.htmlToCanvas(element, displayScale * resizeScale);
    const canvasMaxHeight = this.maxHeight * displayScale;//this.calculateMaxHeight(canvas, scale * fillScale);
    console.log("DEBUG AFTER CONVERTING TO CANVAS", canvasMaxHeight, element.offsetHeight);
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
        console.log('DEBUG CROP CANVAS', offsetY, pageIndex +1 )
        const height = CanvasUtils.calculateHeightOffset({
          maxHeight: canvasMaxHeight,
          height: canvas.height,
          offsetY,
        });
        const croppedCanvas = CanvasUtils.cropY({
          width,
          height,
          offsetY,
          canvas,
        });
        return new Image(croppedCanvas, displayScale);
      });
  }
}
