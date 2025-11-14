import {
  DocumentConverterOptions,
  FooterHeaderProps,
  TargetElement,
} from "../types";

import { CanvasConverter } from "./canvasConverter";
import { DEFAULT_OPTIONS } from "../constants";
import { Document } from "../models/document";
import * as utils from "../utils";
import { PageImagesBuilder } from "./pageImagesBuilder";
import { PageImagesPositioner } from "./pageImagesPositioner";
import { FooterHeaderService } from "./footerHeaderService";

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
  async createDocumentAdvanced(
    targets: TargetElement[]
  ): Promise<InstanceType<typeof Document>> {
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
    const pageBuilder = new PageImagesBuilder(
      targetsWithImages,
      Math.floor(documentMaxHeight * this.options.resolution)
    );
    const positioner = new PageImagesPositioner(document, this.options);
    const pages = pageBuilder.createPages();
    await Promise.all(
      pages.map(async (page) => {
        const pageNumber = page.getNumber();
        if (pageNumber > 1) {
          document.addPage();
        }
        const imagesWithCoordinates =
          positioner.calculateCoordinatesPageImages(page);
        await Promise.all(
          imagesWithCoordinates.map(async (imageWithCoordinates) => {
            const { width, height, x, y } = imageWithCoordinates;
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
              y,
            });
            await this.options.hooks?.afterAddCanvasToPage({
              document,
              page: pageNumber,
              canvas: imageWithCoordinates.image.getCanvas(),
            });
          })
        );
      })
    );
    return document;
  }
  async createDocument(
    element: HTMLElement
  ): Promise<InstanceType<typeof Document>> {
    return this.createDocumentAdvanced([{ element }]);
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
    const service = new FooterHeaderService(this.options);
    return service.addFooterAndHeaderToDocument({
      document,
      footerElements,
      headerElements,
    });
  }
}
