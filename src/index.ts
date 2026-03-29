import { MutableRefObject, useCallback, useRef } from "react";

import jsPDF from "jspdf";
import { Document } from "./models/document";
import { Options, PDFHandle, TargetElementFinder, UsePDFResult } from "./types";
import { DocumentConverter } from "./services/documentConverter";
export { Margin, Resolution, Alignment as Position, Size } from "./constants";
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
  const element = targetRefOrGetter?.current;
  return element;
};

/**
 * React hook for generating PDF documents from HTML elements.
 *
 * @param usePDFoptions - Configuration options for PDF generation (optional)
 * @returns An object containing:
 *   - targetRef: React ref to attach to the element you want to convert
 *   - toPDF: Function to trigger PDF generation, returns a Promise<jsPDF>
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
    (toPDFoptions?: Options): Promise<InstanceType<typeof jsPDF>> => {
      return generatePDF(targetRef, usePDFoptions ?? toPDFoptions);
    },
    [targetRef, usePDFoptions]
  );
  return { targetRef, toPDF };
};

/**
 * Creates a PDF document from an HTML element without triggering any action (save/open/print).
 * Returns the Document instance for further manipulation.
 *
 * @param targetRefOrGetter - React ref, getter function, or PDFHandle to get the target element.
 *   Examples: `containerRef`, `() => document.getElementById('myElement')`
 * @param options - Configuration options for PDF generation (optional)
 * @returns Promise resolving to the Document instance, or null if element not found
 * @throws Error if PDF generation fails
 *
 * @example
 * ```tsx
 * const doc = await create(containerRef, { filename: 'report.pdf' });
 * // Use doc.save(), doc.open(), or doc.print() manually
 * ```
 */
export const create = async <T extends HTMLElement>(
  targetRefOrGetter: TargetElementFinder<T>,
  options?: Options
): Promise<InstanceType<typeof Document> | null> => {
  try {
    const targetElementOrPDFHandle =
      getTargetElementOrPDFHandle(targetRefOrGetter);
    if (!targetElementOrPDFHandle) {
      console.error("Unable to get the target element.");
      return null;
    }
    if ("getDocument" in targetElementOrPDFHandle) {
      return targetElementOrPDFHandle.getDocument();
    }
    const converter = new DocumentConverter(options);
    return await converter.createDocument(targetElementOrPDFHandle);
  } catch (error) {
    console.error("Failed to create PDF document:", error);
    throw error;
  }
};

/**
 * Creates a PDF document from an HTML element and opens it in a new browser tab.
 *
 * @param targetRefOrGetter - React ref, getter function, or PDFHandle to get the target element.
 *   Examples: `containerRef`, `() => document.getElementById('myElement')`
 * @param options - Configuration options for PDF generation (optional)
 * @returns Promise that resolves when the PDF is opened
 * @throws Error if PDF generation or opening fails
 *
 * @example
 * ```tsx
 * await open(containerRef, { page: { orientation: 'landscape' } });
 * ```
 */
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

/**
 * Creates a PDF document from an HTML element and downloads it to a file.
 *
 * @param targetRefOrGetter - React ref, getter function, or PDFHandle to get the target element.
 *   Examples: `containerRef`, `() => document.getElementById('myElement')`
 * @param options - Configuration options for PDF generation (optional).
 *   Use `filename` option to specify the download filename.
 * @returns Promise that resolves when the file has been saved
 * @throws Error if PDF generation or saving fails
 *
 * @example
 * ```tsx
 * await save(containerRef, { filename: 'invoice.pdf' });
 * ```
 */
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

/**
 * Creates a PDF document from an HTML element and triggers the browser print dialog.
 *
 * @param targetRefOrGetter - React ref, getter function, or PDFHandle to get the target element.
 *   Examples: `containerRef`, `() => document.getElementById('myElement')`
 * @param options - Configuration options for PDF generation (optional)
 * @returns Promise that resolves when the print dialog is triggered
 * @throws Error if PDF generation fails
 *
 * @example
 * ```tsx
 * await print(containerRef, { page: { format: 'a4' } });
 * ```
 */
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
    switch (options?.method) {
      case "build":
        return document.getInstance();
      case "open": {
        document.open();
        return document.getInstance();
      }
      case "save":
      default: {
        await document.save();
        return document.getInstance();
      }
    }
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    throw error;
  }
};

export default generatePDF;
