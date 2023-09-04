import jsPDF from "jspdf";
import { DEFAULT_OPTIONS } from "./constants";
import { ConversionOptions, Options } from "./types";

export const buildConvertOptions = (options?: Options): ConversionOptions => {
  if (!options) {
    return DEFAULT_OPTIONS;
  }
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    canvas: { ...DEFAULT_OPTIONS.canvas, ...options.canvas },
    page: { ...DEFAULT_OPTIONS.page, ...options.page },
  };
};

export const savePDF = async (
  pdf: InstanceType<typeof jsPDF>,
  options?: Options
) => {
  const pdfFilename = options.filename ?? `${new Date().getTime()}.pdf`;
  await pdf.save(pdfFilename, { returnPromise: true });
};

export const openPDF = (pdf: InstanceType<typeof jsPDF>) => {
  window.open(pdf.output("bloburl"), "_blank");
};
