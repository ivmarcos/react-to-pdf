import * as React from "react";
import html2canvas from "html2canvas";

import Converter from "./converter";
import { ReactToPDFOptions, TargetElementFinder, UsePDFResult } from "./types";
import { buildConvertOptions } from "./utils";
import jsPDF from "jspdf";
export { Resolution, Margin } from "./constants";
export type { ReactToPDFOptions };

const getTargetElement = (
  targetRefOrFunction: TargetElementFinder
): HTMLElement | null | undefined => {
  if (typeof targetRefOrFunction === "function") {
    return targetRefOrFunction();
  }
  return targetRefOrFunction?.current;
};

export const usePDF = (usePDFoptions?: ReactToPDFOptions): UsePDFResult => {
  const targetRef = React.createRef<HTMLElement>();
  const toPDF = React.useCallback(
    (toPDFoptions?: ReactToPDFOptions): Promise<InstanceType<typeof jsPDF>> => {
      return generatePDF(targetRef, usePDFoptions ?? toPDFoptions);
    },
    [targetRef, usePDFoptions]
  );
  return { targetRef, toPDF };
};

const generatePDF = async (
  targetRefOrFunction: TargetElementFinder,
  customOptions?: ReactToPDFOptions
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
      window.open(pdf.output("bloburl"), "_blank");
      return pdf;
    }
    case "save":
    default: {
      const pdfFilename = options.filename ?? `${new Date().getTime()}.pdf`;
      await pdf.save(pdfFilename, { returnPromise: true });
      return pdf;
    }
  }
};

export default generatePDF;
