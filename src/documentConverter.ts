import { DocumentConverterOptions, FooterHeaderOptions } from "./types";

import { CanvasConverter } from "./canvasConverter";
import { Alignment, DEFAULT_OPTIONS } from "./constants";
import { Document } from "./document";
import * as utils from "./utils";
import { off } from "process";
import { Image } from "./image";

export interface DocumentConverterPartialOptions
  extends Omit<Partial<DocumentConverterOptions>, "footer" | "header"> {
  footer?: Partial<FooterHeaderOptions>;
  header?: Partial<FooterHeaderOptions>;
}

export const parseOptions = (
  options?: DocumentConverterPartialOptions
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
      ...options?.footer,
    },
    header: {
      ...DEFAULT_OPTIONS.header,
      ...options?.header,
    },
  };
};

interface ImageCoordinates {
  x: number;
  y: number;
}

interface TargetOptions {
  startOnNewPage: boolean
}
interface TargetElement {
  element: HTMLElement,
  options: TargetOptions
}

interface TargetImage extends Pick<TargetElement, "options">{
  image: Image;
}

class PageImagesBuilder{ 
  private pageHeight: number;
  private targetImages: TargetImage[];
  private pages: Page[];
  constructor(targetImages: TargetImage[], document: InstanceType<typeof Document>){
    this.targetImages = targetImages;
    this.pageHeight = utils.mmToPX(document.getPageMaxHeight())
  }
  private createPage(): InstanceType<typeof Page>{
    const currentNumber = this.pages.length;
    const newPage = new Page({number: currentNumber + 1, height: this.pageHeight})
    this.pages.push(newPage);
    return newPage;
  }
  private splitIntoImages(image: Image): Image[]{
    const imageHeight = image.getHeight();
    const imageWidth = image.getHeight();
    const canvases: HTMLCanvasElement[] = []
    let imageY = 0;
    while (imageY < imageHeight){
      const croppedCanvas = utils.cropY({width: imageWidth, height: this.pageHeight, offsetY: imageY, canvas: image.getCanvas()})
      canvases.push(croppedCanvas)
      imageY = imageY + croppedCanvas.height;
    }
    const images = canvases.map(canvas => new Image(canvas, image.getScale()))
    return images;
  }
  createPages(): Page[]{
    let currentPage: Page = null;
    this.pages = [];
    this.targetImages.forEach((targetImage) => {
      const currentImage = targetImage.image;
      const requiresNewPage = targetImage.options.startOnNewPage;
      if (requiresNewPage || !currentPage){
        currentPage = this.createPage();
      }
      const images = this.splitIntoImages(currentImage);
      images.forEach((image) => {
        if (currentPage.canFit(image)){
          currentPage = this.createPage();
        }
        currentPage.addImage(image);
      });
    })
    return this.pages;
  }
}
class Page {
  number: number;
  images: Image[] = [];
  height: number;
  contentHeight: number;
  constructor({number, height}:{number: number, height: number}){
    this.number = number;
    this.height = height;
  }
  addImage(image){
    this.images.push(image);
    this.contentHeight = this.contentHeight + image.getHeight();
  }
  getAvailableHeight(){
    return this.height - this.contentHeight;
  }
  canFit(image: Image){
    return this.getAvailableHeight() > image.getHeight();
  }
}
export class DocumentConverter {
  options: DocumentConverterOptions;
  constructor(options?: DocumentConverterPartialOptions) {
    this.options = parseOptions(options);
  }
  private calculateHorizontalFitScale(elementWidth: number, maxWidth: number) {
    if (elementWidth > maxWidth) {
      return elementWidth / maxWidth;
    }
    return 1;
  }
  private getResolution() {
    return this.options.resolution;
  }

  private calculateNumberOfPages(element: HTMLElement) {
    const document = new Document(this.options);
    const documentMaxHeight = utils.mmToPX(document.getPageMaxHeight());
    const documentMaxWidth = utils.mmToPX(document.getPageMaxWidth());
    const elementHeight = element.offsetHeight;
    const elementWidth = element.offsetWidth;
    const resizeFitRatio = utils.calculateFitRatio({
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

  private calculateCoordinatesBody(
    document: InstanceType<typeof Document>,
    imageWidth: number,
    imageHeight: number
  ): ImageCoordinates {
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
  private calculateCoordinatesFooter(
    document: InstanceType<typeof Document>,
    imageWidth: number,
    imageHeigth: number
  ): ImageCoordinates {
    console.log(
      "DEBUG FOOTER image width",
      imageWidth,
      document.getPageWidth()
    );
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
  private calculateCoordinatesHeader(
    document: InstanceType<typeof Document>,
    imageWidth: number
  ): ImageCoordinates {
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
  async createDocumentAdvanced(targets: TargetElement[]){
    const document = new Document(this.options);
    const documentMaxHeight = utils.mmToPX(document.getPageMaxHeight());
    const documentMaxWidth = utils.mmToPX(document.getPageMaxWidth());
    const canvasConverter = new CanvasConverter({
      maxHeight: documentMaxHeight,
      maxWidth: documentMaxWidth,
      options: this.options,
    });
    const targetsWithImages = await Promise.all(targets.map(async target => {
      const image = await canvasConverter.htmlToCanvasImage(target.element, true)
      return {
        image,
        options: target.options
      };
    }))
    // const canvasMaxHeight = documentMaxHeight * this.options.resolution; //this.calculateMaxHeight(canvas, scale * fillScale);
    // const allCanvasHeight = targetsWithImages.map(target => target.image.getHeight()).reduce((h1, h2) => h1 + h2, 0);
    const pageBuilder = new PageImagesBuilder(targetsWithImages, document);
    const pages = pageBuilder.createPages();
  }
  async createDocument(
    element: HTMLElement
  ): Promise<InstanceType<typeof Document>> {
    const document = new Document(this.options);
    const documentMaxHeight = utils.mmToPX(document.getPageMaxHeight());
    const documentMaxWidth = utils.mmToPX(document.getPageMaxWidth());
    const canvasConverter = new CanvasConverter({
      maxHeight: documentMaxHeight,
      maxWidth: documentMaxWidth,
      options: this.options,
    });
    const images = await canvasConverter.htmlToCanvasImages(element, true);
    // const image = await canvasConverter.htmlToCanvasImage(element);
    // const images = [image];
    console.log("debug images", images);
    await Promise.all(images.map(async (image, pageIndex) => {
      if (pageIndex) {
        document.addPage();
      }
      const { width, height } = utils.getImageDimensionsMM(image);
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
      await document.addCanvasToPage({
        canvas: image.getCanvas(),
        page,
        width,
        height,
        x,
        y,
      });
    }));
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
    const documentMaxHeight = utils.mmToPX(document.getPageMaxHeight());
    const documentMaxWidth = utils.mmToPX(document.getPageMaxWidth());
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
        const { width, height } = utils.getImageDimensionsMM(footerImage);
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
        const { width, height } = utils.getImageDimensionsMM(headerImage);
        const headerXY = this.calculateCoordinatesHeader(document, width);
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
