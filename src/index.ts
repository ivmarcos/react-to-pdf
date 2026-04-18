import jsPDF from "jspdf";
import { MutableRefObject, useCallback, useRef } from "react";

import { Document } from "./document";
import { renderCanvasBody, getMargins } from "./body/canvas";
import { renderHtmlBody } from "./body/html";
import { stampHeaderFooter } from "./overlay/headerFooter";
import { renderFragmentsPerPage } from "./overlay/renderFragments";
import { resolveOptions } from "./options";
import {
  Options,
  PDFHandle,
  TargetElement,
  TargetElementFinder,
  UsePDFResult,
} from "./types";

export { Margin, Resolution, Alignment as Position, Size } from "./constants";
export { Document } from "./document";
export { resolveOptions } from "./options";
export * from "./components/PDF";
export * from "./components/Body";
export * from "./types";
export { pxToMM, mmToPX } from "./utils";

const getTargetElementOrPDFHandle = <T extends HTMLElement>(
  targetRefOrGetter: TargetElementFinder<T>
): T | MutableRefObject<PDFHandle>["current"] => {
  if (typeof targetRefOrGetter === "function") {
    return targetRefOrGetter();
  }
  return targetRefOrGetter?.current;
};

/**
 * Build a jsPDF document from a DOM element using the configured engine.
 *
 * Internal; the public surface is `create`, `save`, `open`, `print`,
 * `generatePDF`, and the `usePDF` hook.
 */
async function buildDocument<T extends HTMLElement>(
  targetRefOrGetter: TargetElementFinder<T>,
  rawOptions?: Options
): Promise<Document | null> {
  const targetOrHandle = getTargetElementOrPDFHandle(targetRefOrGetter);
  if (!targetOrHandle) {
    console.error("Unable to get the target element.");
    return null;
  }
  if ("getPdf" in targetOrHandle || "getDocument" in targetOrHandle) {
    const handle = targetOrHandle as PDFHandle;
    const pdf = handle.getPdf?.() ?? handle.getDocument?.()?.getInstance();
    if (pdf) return new Document(pdf, rawOptions?.filename);
    return null;
  }

  const options = resolveOptions(rawOptions);
  const doc = new jsPDF({
    format: options.page.format,
    orientation: options.page.orientation,
    unit: "mm",
    ...options.overrides.pdf,
  });

  const targets: TargetElement[] = [{ element: targetOrHandle }];

  // Reserve space for header/footer so body renderers know where to stop.
  const headerReservedMM = options.header
    ? Number(options.header.margin ?? 0) + 30
    : 0;
  const footerReservedMM = options.footer
    ? Number(options.footer.margin ?? 0) + 20
    : 0;

  if (options.engine === "html") {
    await renderHtmlBody(
      doc,
      targets,
      options,
      headerReservedMM,
      footerReservedMM
    );
  } else {
    await renderCanvasBody(doc, targets, options);
  }

  if (options.header || options.footer) {
    const numberOfPages = doc.getNumberOfPages();
    const header = await renderFragmentsPerPage(options.header, numberOfPages);
    const footer = await renderFragmentsPerPage(options.footer, numberOfPages);
    try {
      await stampHeaderFooter(doc, {
        headerElements: header.elements,
        footerElements: footer.elements,
        options,
      });
    } finally {
      header.cleanup();
      footer.cleanup();
    }
  }

  return new Document(doc, options.filename);
}

/**
 * React hook for generating PDF documents from HTML elements.
 *
 * @example
 * ```tsx
 * const { targetRef, toPDF } = usePDF({ filename: 'my-document.pdf' });
 * return (
 *   <div>
 *     <div ref={targetRef}>Content to convert to PDF</div>
 *     <button onClick={() => toPDF()}>Download PDF</button>
 *   </div>
 * );
 * ```
 */
export const usePDF = (usePDFoptions?: Options): UsePDFResult => {
  const targetRef = useRef(null);
  const toPDF = useCallback(
    (toPDFoptions?: Options): Promise<InstanceType<typeof jsPDF>> =>
      generatePDF(targetRef, usePDFoptions ?? toPDFoptions),
    [targetRef, usePDFoptions]
  );
  return { targetRef, toPDF };
};

/**
 * Build a PDF without saving, opening, or printing it. Returns the
 * `Document` facade so callers can trigger actions themselves.
 */
export const create = async <T extends HTMLElement>(
  targetRefOrGetter: TargetElementFinder<T>,
  options?: Options
): Promise<Document | null> => {
  try {
    return await buildDocument(targetRefOrGetter, options);
  } catch (error) {
    console.error("Failed to create PDF document:", error);
    throw error;
  }
};

export const open = async <T extends HTMLElement>(
  targetRefOrGetter: TargetElementFinder<T>,
  options?: Options
) => {
  try {
    const document = await create(targetRefOrGetter, options);
    document?.open();
  } catch (error) {
    console.error("Failed to open PDF document:", error);
    throw error;
  }
};

export const save = async <T extends HTMLElement>(
  targetRefOrGetter: TargetElementFinder<T>,
  options?: Options
): Promise<void> => {
  try {
    const document = await create(targetRefOrGetter, options);
    return document?.save();
  } catch (error) {
    console.error("Failed to save PDF document:", error);
    throw error;
  }
};

export const print = async <T extends HTMLElement>(
  targetRefOrGetter: TargetElementFinder<T>,
  options?: Options
) => {
  try {
    const document = await create(targetRefOrGetter, options);
    document?.print();
  } catch (error) {
    console.error("Failed to print PDF document:", error);
    throw error;
  }
};

const generatePDF = async <T extends HTMLElement>(
  targetRefOrGetter: TargetElementFinder<T>,
  options?: Options
): Promise<InstanceType<typeof jsPDF>> => {
  try {
    const document = await create(targetRefOrGetter, options);
    if (!document) {
      throw new Error("Failed to create PDF document.");
    }
    switch (options?.method) {
      case "build":
        return document.getInstance();
      case "open":
        document.open();
        return document.getInstance();
      case "save":
      default:
        await document.save();
        return document.getInstance();
    }
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    throw error;
  }
};

export default generatePDF;

// Re-export internal building blocks that advanced consumers used.
export { renderCanvasBody, getMargins };
export { renderHtmlBody };
