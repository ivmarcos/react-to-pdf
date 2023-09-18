import html2canvas from "html2canvas";
import { useCallback, useRef } from "react";

import jsPDF from "jspdf";
import { DocumentConverter } from "./converter";
import { Options, TargetElementFinder, UsePDFResult } from "./types";
export { Margin, Resolution } from "./constants";
export * from "./PDF";
export * from "./types";

const getTargetElement = (targetRefOrFunction: TargetElementFinder) => {
  if (typeof targetRefOrFunction === "function") {
    return targetRefOrFunction();
  }
  return targetRefOrFunction?.current;
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

const generatePDF = async (
  targetRefOrFunction: TargetElementFinder,
  options?: Options
): Promise<InstanceType<typeof jsPDF>> => {
  const targetElement = getTargetElement(targetRefOrFunction);
  if (!targetElement) {
    console.error("Unable to get the target element.");
    return;
  }
  const converter = new DocumentConverter(options);
  const document = await converter.convert(targetElement);
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
