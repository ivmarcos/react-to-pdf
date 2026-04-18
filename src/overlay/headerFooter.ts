import html2canvas from "html2canvas";
import type jsPDF from "jspdf";
import type { FooterHeaderProps, ResolvedOptions } from "../types";
import * as utils from "../utils";

/**
 * Stamp header and/or footer images onto every page of the document.
 * Engine-agnostic: works for the canvas body renderer and the html body
 * renderer alike, as long as the body reserved enough top/bottom margin.
 */
export async function stampHeaderFooter(
  doc: InstanceType<typeof jsPDF>,
  {
    headerElements,
    footerElements,
    options,
  }: {
    headerElements: (HTMLElement | null)[];
    footerElements: (HTMLElement | null)[];
    options: ResolvedOptions;
  }
): Promise<void> {
  if (!options.header && !options.footer) return;

  const pageWidthMM = doc.internal.pageSize.getWidth();
  const pageHeightMM = doc.internal.pageSize.getHeight();
  const pageMaxWidthPX = utils.mmToPX(pageWidthMM);
  const scale = options.engine === "html" ? options.html.fragmentScale : 2;

  const rasterise = async (
    element: HTMLElement | null
  ): Promise<HTMLCanvasElement | null> => {
    if (!element) return null;
    return html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
    });
  };

  const headerCanvases = await Promise.all(headerElements.map(rasterise));
  const footerCanvases = await Promise.all(footerElements.map(rasterise));

  const numberOfPages = doc.getNumberOfPages();
  for (let pageIndex = 0; pageIndex < numberOfPages; pageIndex++) {
    const pageNumber = pageIndex + 1;
    doc.setPage(pageNumber);

    const headerCanvas = headerCanvases[pageIndex];
    if (headerCanvas && options.header) {
      await addFragment({
        doc,
        canvas: headerCanvas,
        placement: "header",
        config: options.header,
        pageWidthMM,
        pageHeightMM,
        pageMaxWidthPX,
        scale,
      });
    }

    const footerCanvas = footerCanvases[pageIndex];
    if (footerCanvas && options.footer) {
      await addFragment({
        doc,
        canvas: footerCanvas,
        placement: "footer",
        config: options.footer,
        pageWidthMM,
        pageHeightMM,
        pageMaxWidthPX,
        scale,
      });
    }
  }
}

async function addFragment({
  doc,
  canvas,
  placement,
  config,
  pageWidthMM,
  pageHeightMM,
  pageMaxWidthPX,
  scale,
}: {
  doc: InstanceType<typeof jsPDF>;
  canvas: HTMLCanvasElement;
  placement: "header" | "footer";
  config: FooterHeaderProps;
  pageWidthMM: number;
  pageHeightMM: number;
  pageMaxWidthPX: number;
  scale: number;
}): Promise<void> {
  const widthMM = utils.pxToMM(canvas.width / scale);
  const heightMM = utils.pxToMM(canvas.height / scale);
  const margin = Number(config.margin ?? 0);

  let x: number;
  switch (config.align) {
    case "left":
      x = 0;
      break;
    case "right":
      x = pageWidthMM - widthMM;
      break;
    default:
      x = pageWidthMM / 2 - widthMM / 2;
  }

  const y = placement === "header" ? margin : pageHeightMM - margin - heightMM;

  const imageData = canvas.toDataURL("image/png");
  doc.addImage({
    imageData,
    width: widthMM,
    height: heightMM,
    x,
    y,
  });
  void pageMaxWidthPX; // reserved for future width-clipping use
}
