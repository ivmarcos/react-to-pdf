import html2canvas from "html2canvas";
import { useCallback, useRef } from "react";

import jsPDF from "jspdf";
import Converter from "./converter";
import { Options, TargetElementFinder, UsePDFResult } from "./types";
import { buildConvertOptions, openPDF, savePDF } from "./utils";
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
  customOptions?: Options
): Promise<InstanceType<typeof jsPDF>> => {
  const options = buildConvertOptions(customOptions);
  const targetElement = getTargetElement(targetRefOrFunction);
  if (!targetElement) {
    console.error("Unable to get the target element.");
    return;
  }
  const canvas = await html2canvas(targetElement, {
    useCORS: options.canvas.useCORS,
    logging: options.canvas.logging,
    scale: options.resolution,
    ...options.overrides?.canvas,
  });
  const converter = new Converter(canvas, options);
  const pdf = converter.convert();
  switch (options.method) {
    case "build":
      return pdf;
    case "open": {
      openPDF(pdf);
      return pdf;
    }
    case "save":
    default: {
      await savePDF(pdf, options);
      return pdf;
    }
  }
};

export default generatePDF;
