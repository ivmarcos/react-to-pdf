import html2canvas from "html2canvas";
import type jsPDF from "jspdf";
import { Alignment, Size } from "../constants";
import { Document } from "../document";
import type {
  ImageCoordinates,
  ResolvedOptions,
  TargetElement,
} from "../types";
import * as utils from "../utils";

/**
 * Canvas-engine body renderer. Captures each target with html2canvas, slices
 * the resulting canvas into page-sized chunks, and adds each chunk as an
 * image to the jsPDF document.
 *
 * `reservedTopMM` / `reservedBottomMM` shrink the effective content height
 * beyond `page.margin` so header/footer fragments can sit above and below
 * the body without overlapping.
 *
 * Replaces the old `DocumentConverter` / `CanvasConverter` /
 * `PageImagesBuilder` / `PageImagesPositioner` class tree — their logic is
 * inlined here.
 */
export async function renderCanvasBody(
  doc: InstanceType<typeof jsPDF>,
  targets: TargetElement[],
  options: ResolvedOptions,
  reservedTopMM = 0,
  reservedBottomMM = 0
): Promise<void> {
  if (targets.length === 0) return;

  const pageMaxHeightMM =
    getPageMaxHeight(doc, options) - reservedTopMM - reservedBottomMM;
  const pageMaxWidthMM = getPageMaxWidth(doc, options);
  const pageMaxHeightPX = utils.mmToPX(pageMaxHeightMM);
  const pageMaxWidthPX = utils.mmToPX(pageMaxWidthMM);

  // 1. html2canvas each target → captured canvas + original display scale.
  const captured = await Promise.all(
    targets.map(async (target) => {
      const displayScale = options.canvas.resolution;
      const resizeScale = calculateResizeScale(
        target.element,
        pageMaxWidthPX,
        options.canvas.size
      );
      const canvas = await html2canvas(target.element, {
        scale: displayScale * resizeScale,
        windowWidth: target.element.scrollWidth,
        windowHeight: target.element.scrollHeight,
        useCORS: options.canvas.overrides.useCORS,
        logging: options.canvas.overrides.logging,
        ...options.canvas.overrides,
      });
      return {
        canvas,
        displayScale,
        startOnNewPage: target.options?.startOnNewPage ?? false,
      };
    })
  );

  // 2. Build the per-page slice list.
  type PageSlice = {
    canvas: HTMLCanvasElement;
    displayScale: number;
    heightInPageHeights: number; // how much of a page this slice fills
  };
  const pages: PageSlice[][] = [];
  const pageCanvasMaxHeightPX = Math.floor(
    pageMaxHeightPX * options.canvas.resolution
  );

  for (const entry of captured) {
    if (entry.startOnNewPage || pages.length === 0) {
      pages.push([]);
    }
    let y = 0;
    const h = entry.canvas.height;
    while (y < h) {
      let currentPage = pages[pages.length - 1];
      const usedHeight = currentPage.reduce(
        (sum, slice) => sum + slice.canvas.height,
        0
      );
      const available = pageCanvasMaxHeightPX - usedHeight;
      if (available <= 0) {
        pages.push([]);
        currentPage = pages[pages.length - 1];
      }
      const currentAvailable =
        pageCanvasMaxHeightPX -
        currentPage.reduce((sum, slice) => sum + slice.canvas.height, 0);
      const remaining = h - y;
      const sliceHeight = Math.min(remaining, currentAvailable);
      const slice =
        sliceHeight === h && y === 0
          ? entry.canvas
          : utils.cropY({
              width: entry.canvas.width,
              height: sliceHeight,
              offsetY: y,
              canvas: entry.canvas,
            });
      currentPage.push({
        canvas: slice,
        displayScale: entry.displayScale,
        heightInPageHeights: sliceHeight / pageCanvasMaxHeightPX,
      });
      y += sliceHeight;
    }
  }

  // 3. Write each page to jsPDF.
  const hooks = options.canvas.hooks;
  const docFacade = new Document(doc, options.filename);

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const pageNumber = pageIndex + 1;
    if (pageNumber > 1) {
      doc.addPage(options.page.format, options.page.orientation);
    }
    doc.setPage(pageNumber);

    const slices = pages[pageIndex];
    const contentHeightMM = slices.reduce(
      (sum, slice) =>
        sum + utils.pxToMM(slice.canvas.height / slice.displayScale),
      0
    );
    let cursorYOffsetMM = 0;

    for (const slice of slices) {
      const widthMM = utils.pxToMM(slice.canvas.width / slice.displayScale);
      const heightMM = utils.pxToMM(slice.canvas.height / slice.displayScale);
      const margin = getMargins(options);
      const coords = placeOnPage({
        doc,
        imageWidth: widthMM,
        imageHeight: heightMM,
        align: options.canvas.align,
        pageCount: pages.length,
        contentHeightMM,
        cursorYOffsetMM,
        margin: {
          ...margin,
          top: margin.top + reservedTopMM,
          bottom: margin.bottom + reservedBottomMM,
        },
      });

      const hookPayload = {
        doc,
        document: docFacade,
        page: pageNumber,
        canvas: slice.canvas,
      };
      if (hooks.beforeAddPage) await hooks.beforeAddPage(hookPayload);

      const imageData = slice.canvas.toDataURL(
        options.canvas.mimeType,
        options.canvas.quality
      );
      doc.addImage({
        imageData,
        width: widthMM,
        height: heightMM,
        x: coords.x,
        y: coords.y,
      });

      if (hooks.afterAddPage) await hooks.afterAddPage(hookPayload);

      cursorYOffsetMM += heightMM;
    }
  }
}

function calculateResizeScale(
  element: HTMLElement,
  pageMaxWidthPX: number,
  size: ResolvedOptions["canvas"]["size"]
): number {
  switch (size) {
    case Size.SHRINK_TO_FIT:
      return utils.calculateFitRatio({
        maxSize: pageMaxWidthPX,
        size: element.offsetWidth,
      });
    case Size.FILL_PAGE:
      return utils.calculateFillRatio({
        targetSize: pageMaxWidthPX,
        size: element.offsetWidth,
      });
    default:
      return 1;
  }
}

interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function getMargins(options: ResolvedOptions): Margins {
  const m = options.page.margin;
  if (typeof m === "object") {
    return {
      top: Number(m.top),
      right: Number(m.right),
      bottom: Number(m.bottom),
      left: Number(m.left),
    };
  }
  const v = Number(m);
  return { top: v, right: v, bottom: v, left: v };
}

export function getPageMaxWidth(
  doc: InstanceType<typeof jsPDF>,
  options: ResolvedOptions
): number {
  const m = getMargins(options);
  return doc.internal.pageSize.getWidth() - m.left - m.right;
}

export function getPageMaxHeight(
  doc: InstanceType<typeof jsPDF>,
  options: ResolvedOptions
): number {
  const m = getMargins(options);
  return doc.internal.pageSize.getHeight() - m.top - m.bottom;
}

function placeOnPage({
  doc,
  imageWidth,
  imageHeight,
  align,
  pageCount,
  contentHeightMM,
  cursorYOffsetMM,
  margin,
}: {
  doc: InstanceType<typeof jsPDF>;
  imageWidth: number;
  imageHeight: number;
  align: ResolvedOptions["canvas"]["align"];
  pageCount: number;
  contentHeightMM: number;
  cursorYOffsetMM: number;
  margin: Margins;
}): ImageCoordinates {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  switch (align) {
    case Alignment.CENTER_XY:
      return {
        x: pageWidth / 2 - imageWidth / 2,
        y: pageHeight / 2 - contentHeightMM / 2 + cursorYOffsetMM,
      };
    case Alignment.CENTER_X:
      return {
        x: pageWidth / 2 - imageWidth / 2,
        y: margin.top + cursorYOffsetMM,
      };
    case Alignment.CENTER_Y:
      if (pageCount > 1) {
        return {
          x: margin.left,
          y: margin.top + cursorYOffsetMM,
        };
      }
      return {
        x: margin.left,
        y: pageHeight / 2 - imageHeight / 2,
      };
    default:
      return {
        x: margin.left,
        y: margin.top + cursorYOffsetMM,
      };
  }
}
