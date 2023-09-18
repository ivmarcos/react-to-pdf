import jsPDF from "jspdf";
import { DEFAULT_OPTIONS, MM_TO_PX } from "./constants";
import { ConversionOptions, Options } from "./types";

export const parseConversionOptions = (
  options?: Options
): ConversionOptions => {
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

export const mmToPX = (mm: number) => mm * MM_TO_PX;
export const pxToMM = (px: number) => px / MM_TO_PX;
