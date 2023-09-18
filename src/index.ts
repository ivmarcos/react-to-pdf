import { useCallback, useRef } from "react";

import jsPDF from "jspdf";
import { DocumentConverter } from "./converter";
import { Options, TargetElementFinder, UsePDFResult } from "./types";
export { Margin, Resolution, Position, Size } from "./constants";
export * from "./PDF";
export * from "./types";
export {pxToMM, mmToPX} from './utils'

const getTargetElement = (targetRefOrFunction: TargetElementFinder): HTMLElement | undefined => {
  if (typeof targetRefOrFunction === "function") {
    return targetRefOrFunction();
  }
  const element = targetRefOrFunction?.current;
  if (!element) {
    console.error("Unable to get the target element.");
  }
  return element;
};

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

export const open = async (targetRefOrFunction: TargetElementFinder, options?: Options) => {
  const targetElement = getTargetElement(targetRefOrFunction);
  if (!targetElement) {
    return;
  }
  const converter = new DocumentConverter(options);
  const document = await converter.createDocument(targetElement);
  document.open();
}

export const save = async (targetRefOrFunction: TargetElementFinder, options?: Options) => {
  const targetElement = getTargetElement(targetRefOrFunction);
  if (!targetElement) {
    return;
  }
  const converter = new DocumentConverter(options);
  const document = await converter.createDocument(targetElement);
  return document.save();
}

export const create = async (targetRefOrFunction: TargetElementFinder, options?: Options) => {
  const targetElement = getTargetElement(targetRefOrFunction);
  if (!targetElement) {
    return;
  }
  const converter = new DocumentConverter(options);
  return converter.createDocument(targetElement);
}

const generatePDF = async (
  targetRefOrFunction: TargetElementFinder,
  options?: Options
): Promise<InstanceType<typeof jsPDF>> => {
  const targetElement = getTargetElement(targetRefOrFunction);
  if (!targetElement) {
    return;
  }
  const converter = new DocumentConverter(options);
  const document = await converter.createDocument(targetElement);
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
