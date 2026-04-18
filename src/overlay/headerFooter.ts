import html2canvas from "html2canvas";
import type jsPDF from "jspdf";
import { getMargins } from "../body/canvas";
import type { FooterHeaderProps, ResolvedOptions } from "../types";

/**
 * Stamp header and/or footer images onto every page of the document.
 * Engine-agnostic: works for the canvas body renderer and the html body
 * renderer alike, as long as the body reserved enough top/bottom margin.
 *
 * Headers/footers are drawn spanning the full printable width of the page
 * (page width minus left/right margins). The fragment's own layout (flex,
 * grid, absolute positioning) is responsible for arranging its contents
 * within that band.
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
  const margins = getMargins(options);
  const contentWidthMM = pageWidthMM - margins.left - margins.right;
  const scale = options.engine === "html" ? options.html.fragmentScale : 2;

  const rasterise = async (
    element: HTMLElement | null
  ): Promise<HTMLCanvasElement | null> => {
    if (!element) return null;
    return html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: null,
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
        contentWidthMM,
        leftMM: margins.left,
        pageHeightMM,
      });
    }

    const footerCanvas = footerCanvases[pageIndex];
    if (footerCanvas && options.footer) {
      await addFragment({
        doc,
        canvas: footerCanvas,
        placement: "footer",
        config: options.footer,
        contentWidthMM,
        leftMM: margins.left,
        pageHeightMM,
      });
    }
  }
}

async function addFragment({
  doc,
  canvas,
  placement,
  config,
  contentWidthMM,
  leftMM,
  pageHeightMM,
}: {
  doc: InstanceType<typeof jsPDF>;
  canvas: HTMLCanvasElement;
  placement: "header" | "footer";
  config: FooterHeaderProps;
  contentWidthMM: number;
  leftMM: number;
  pageHeightMM: number;
}): Promise<void> {
  // Draw the fragment at the full printable width, preserving its aspect
  // ratio to compute the height it occupies on the page.
  const widthMM = contentWidthMM;
  const heightMM = (canvas.height / canvas.width) * widthMM;
  const marginEdgeMM = Number(config.margin ?? 0);

  const x = leftMM;
  const y =
    placement === "header"
      ? marginEdgeMM
      : pageHeightMM - marginEdgeMM - heightMM;

  const imageData = canvas.toDataURL("image/png");
  doc.addImage({
    imageData,
    width: widthMM,
    height: heightMM,
    x,
    y,
  });
}
