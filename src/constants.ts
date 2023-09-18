import { AlignmentOption, DocumentConverterOptions, PDFOptions, SizeOption } from "./types";

export const MM_TO_PX = 3.77952755906;
export const PREVIEW_ROOT_CLASS_NAME = "react-to-pdf-preview";

export enum Resolution {
  LOW = 1,
  NORMAL = 2,
  MEDIUM = 3,
  HIGH = 7,
  EXTREME = 12,
}

export enum Margin {
  NONE = 0,
  SMALL = 5,
  MEDIUM = 10,
  LARGE = 25,
}


export const Alignment: Record<string, AlignmentOption> = {
  TOP_LEFT: "top-left",
  CENTER_Y: "center-y",
  CENTER_X: "center-x",
  CENTER_XY: "center-xy",
}


export const Size: Record<string, SizeOption> = {
  ORIGINAL: "original",
  FILL_PAGE: "fill-page",
  SHRINK_TO_FIT: "shrink-to-fit",
}

export const DEFAULT_OPTIONS: Readonly<DocumentConverterOptions> = {
  resolution: Resolution.MEDIUM,
  page: {
    margin: Margin.NONE,
    format: "A4",
    orientation: "portrait",
  },
  canvas: {
    mimeType: "image/jpeg",
    qualityRatio: .9,
    useCORS: true,
    logging: false,
  },
  overrides: {},
  align: Alignment.TOP_LEFT,
  size: Size.ORIGINAL,
  header: {
    margin: 7,
    align: "center",
  },
  footer: {
    margin: 7,
    align: "center",
  },
};
