import { useCallback, useRef } from "react";

import jsPDF from "jspdf";
import { DocumentConverter, Document } from "./converter";
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

export const create = async (targetRefOrFunction: TargetElementFinder, options?: Options): Promise<InstanceType<typeof Document> | null> => {
  const targetElement = getTargetElement(targetRefOrFunction);
  if (!targetElement) {
    console.error("Unable to get the target element.");
    return null;
  }
  const converter = new DocumentConverter(options);
  return converter.createDocument(targetElement);
}

export const open = async (targetRefOrFunction: TargetElementFinder, options?: Options) => {
  const document = await create(targetRefOrFunction, options);
  document?.open();
}

export const save = async (targetRefOrFunction: TargetElementFinder, options?: Options) => {
  const document = await create(targetRefOrFunction, options);
  return document?.save();
}

export const print = async (targetRefOrFunction: TargetElementFinder, options?: Options) => {
  const document = await create(targetRefOrFunction, options);
  document?.print();
}

const generatePDF = async (
  targetRefOrFunction: TargetElementFinder,
  options?: Options
): Promise<InstanceType<typeof jsPDF>> => {
  const document = await create(targetRefOrFunction, options);
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
