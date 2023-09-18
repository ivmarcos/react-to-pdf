import { MutableRefObject, useCallback, useRef } from "react";

import jsPDF from "jspdf";
import { Document } from "./document";
import { Options, PDFHandle, TargetElementFinder, UsePDFResult } from "./types";
import { DocumentConverter } from "./documentConverter";
export { Margin, Resolution, Alignment as Position, Size } from "./constants";
export * from "./PDF";
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
 * Create a document from the target element and download to a file.
 * @param targetRefOrGetter The target ref or a getter function to return the target element.
 * e.g `() => document.getElementById('id')` or `containerRef`
 * @param options Options
 * @returns Promise<void>
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
 * Create a document from the target element and download to a file.
 * @param targetRefOrGetter The target ref or a getter function to return the target element.
 * e.g `() => document.getElementById('id')` or `containerRef`
 * @param options Options
 * @returns the document instance
 */
export const create = async <T extends HTMLElement>(
  targetRefOrGetter: TargetElementFinder<T>,
  options?: Options
): Promise<InstanceType<typeof Document> | null> => {
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
  return converter.createDocument(targetElementOrPDFHandle);
};

/**
 * Create a document from the target element and download to a file.
 * @param targetRefOrGetter The target ref or a getter function to return the target element.
 * e.g `() => document.getElementById('id')` or `containerRef`
 * @param options Options
 * @returns Promise<void>
 */
export const open = async <T extends HTMLElement>(
  targetRefOrGetter: TargetElementFinder<T>,
  options?: Options
) => {
  const document = await create(targetRefOrGetter, options);
  document?.open();
};

/**
 * Create a document from the target element and download to a file.
 * @param targetRefOrGetter The target ref or a getter function to return the target element.
 * e.g `() => document.getElementById('id')` or `containerRef`
 * @param options Options
 * @returns Promise<void>
 */
export const save = async <T extends HTMLElement>(
  targetRefOrGetter: TargetElementFinder<T>,
  options?: Options
): Promise<void> => {
  const document = await create(targetRefOrGetter, options);
  console.log("document", document);
  return document?.save();
};

/**
 * Create a document from the target element and download to a file.
 * @param targetRefOrGetter The target ref or a getter function to return the target element.
 * e.g `() => document.getElementById('id')` or `containerRef`
 * @param options Options
 * @returns Promise<void>
 */
export const print = async <T extends HTMLElement>(
  targetRefOrGetter: TargetElementFinder<T>,
  options?: Options
) => {
  const document = await create(targetRefOrGetter, options);
  document?.print();
};

const generatePDF = async <T extends HTMLElement>(
  targetRefOrGetter: TargetElementFinder<T>,
  options?: Options
): Promise<InstanceType<typeof jsPDF>> => {
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
};

export default generatePDF;
