import { Document } from "../models/document";
import { Image } from "../models/image";
import { CanvasConverter } from "./canvasConverter";
import { PageImagesPositioner } from "./pageImagesPositioner";
import { DocumentConverterOptions } from "../types";
import * as utils from "../utils";

/**
 * Service responsible for adding headers and footers to PDF documents.
 */
export class FooterHeaderService {
  private options: DocumentConverterOptions;

  constructor(options: DocumentConverterOptions) {
    this.options = options;
  }

  /**
   * Adds footer and header elements to an existing PDF document.
   *
   * @param document - The PDF document to add footers/headers to
   * @param footerElements - Array of HTML elements to render as footers (one per page)
   * @param headerElements - Array of HTML elements to render as headers (one per page)
   * @returns The updated document with footers and headers
   */
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
    const positioner = new PageImagesPositioner(document, this.options);

    for (let pageIndex = 0; pageIndex < numberOfPages; pageIndex++) {
      const page = pageIndex + 1;
      const footerImage = footerImages[pageIndex];
      const headerImage = headerImages[pageIndex];

      if (footerImage) {
        await this.addImageToPage(
          document,
          footerImage,
          page,
          positioner.calculateCoordinatesFooter
        );
      }

      if (headerImage) {
        await this.addImageToPage(
          document,
          headerImage,
          page,
          positioner.calculateCoordinatesHeader
        );
      }
    }

    return document;
  }

  /**
   * Helper method to add an image to a specific page with calculated coordinates.
   */
  private async addImageToPage(
    document: InstanceType<typeof Document>,
    image: Image,
    page: number,
    calculateCoordinates: (
      width: number,
      height?: number
    ) => { x: number; y: number }
  ): Promise<void> {
    const { width, height } = utils.getImageDimensionsMM(image);
    const coordinates = calculateCoordinates.call(
      new PageImagesPositioner(document, this.options),
      width,
      height
    );

    await document.addCanvasToPage({
      canvas: image.getCanvas(),
      page,
      width,
      height,
      ...coordinates,
    });
  }
}
