import { DocumentConverterOptions, FooterHeaderProps, TargetElement } from "../types";

import { CanvasConverter } from "./canvasConverter";
import { Alignment, DEFAULT_OPTIONS } from "../constants";
import { Document } from "./document";
import * as utils from "../utils";
import { PageImagesBuilder } from "./pageImagesBuilder";
import { PageImagesPositioner } from "./pageImagesPositioner";
import { log } from "../tests/testUtils";


export interface DocumentConverterPartialOptions
  extends Omit<Partial<DocumentConverterOptions>, "footer" | "header"> {
  footer?: Partial<FooterHeaderProps>;
  header?: Partial<FooterHeaderProps>;
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




export class DocumentConverter {
  options: DocumentConverterOptions;
  constructor(options?: DocumentConverterPartialOptions) {
    this.options = parseOptions(options);
  }
  async createDocumentAdvanced(targets: TargetElement[]): Promise<InstanceType<typeof Document>> {
    const document = new Document(this.options);
    const documentMaxHeight = utils.mmToPX(document.getPageMaxHeight());
    const documentMaxWidth = utils.mmToPX(document.getPageMaxWidth());
    const canvasConverter = new CanvasConverter({
      maxHeight: documentMaxHeight,
      maxWidth: documentMaxWidth,
      options: this.options,
    });
    const targetsWithImages = await Promise.all(
      targets.map(async (target) => {
        const image = await canvasConverter.htmlToCanvasImage(
          target.element,
          true
        );
        return {
          image,
          options: target.options,
        };
      })
    );
    console.log('targetsWithImages', targetsWithImages)
    // document.addCanvasToPage({canvas: targetsWithImages[0].image.getCanvas(), page: 1, width: 200, height: 100, x: 0, y: 0})
    // const canvasMaxHeight = documentMaxHeight * this.options.resolution; //this.calculateMaxHeight(canvas, scale * fillScale);
    // const allCanvasHeight = targetsWithImages.map(target => target.image.getHeight()).reduce((h1, h2) => h1 + h2, 0);
    const pageBuilder = new PageImagesBuilder(targetsWithImages, Math.floor(documentMaxHeight * this.options.resolution));
    const positioner = new PageImagesPositioner(document, this.options);
    const pages = pageBuilder.createPages();
    console.log('debug pages', pages)
    await Promise.all(
      pages.map(async (page) => {
        const pageNumber = page.getNumber();
        if (pageNumber > 1) {
          document.addPage();
        }
        const imagesWithCoordinates = positioner.calculateCoordinatesPageImages(
          page
        );
        await Promise.all(
          imagesWithCoordinates.map(async (imageWithCoordinates, imageIndex) => {
            const { width, height, x, y } = imageWithCoordinates;
            console.log('coordinates', JSON.stringify({page: pageNumber, imageIndex, width, height, x, y }, null, 2))
            await this.options.hooks?.beforeAddCanvasToPage({
              document,
              page: pageNumber,
              canvas: imageWithCoordinates.image.getCanvas(),
            });
            await document.addCanvasToPage({
              canvas: imageWithCoordinates.image.getCanvas(),
              page: pageNumber,
              width,
              height,
              x,
              y
            });
            await this.options.hooks?.afterAddCanvasToPage({
              document,
              page: pageNumber,
              canvas: imageWithCoordinates.image.getCanvas(),
            });
          })
        );
      }));
      return document;
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
    const positioner = new PageImagesPositioner(document, this.options);
    await Promise.all(
      images.map(async (image, pageIndex) => {
        if (pageIndex) {
          document.addPage();
        }
        const { width, height } = utils.getImageDimensionsMM(image);
        const { x, y } = positioner.calculateCoordinatesBody(width, height);
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
      })
    );
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
    console.log('adding footer element', footerElements[0])
    log("adding footer element", footerElements[0].offsetWidth)
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
    const positioner = new PageImagesPositioner(document, this.options);
    while (pageIndex < numberOfPages) {
      const page = pageIndex + 1;
      const footerImage = footerImages[pageIndex];
      const headerImage = headerImages[pageIndex];
      if (footerImage) {
        const { width, height } = utils.getImageDimensionsMM(footerImage);
        const footerXY = positioner.calculateCoordinatesFooter(
          width,
          height
        );
        log("adding footer image", {footerXY, width, height, imageWidth: footerImage.getOriginalWidth(), imageScaledWidth: footerImage.getWidth(), imageScale: footerImage.getScale()});
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
        const headerXY = positioner.calculateCoordinatesHeader(width);
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
