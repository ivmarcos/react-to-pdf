import { ConversionOptions } from "./types";

export const MM_TO_PX = 3.77952755906;

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

export const DEFAULT_OPTIONS: Readonly<ConversionOptions> = {
  method: "save",
  resolution: Resolution.MEDIUM,
  page: {
    margin: Margin.NONE,
    format: "A4",
    orientation: "portrait",
  },
  canvas: {
    mimeType: "image/jpeg",
    qualityRatio: 1,
    useCORS: true,
    logging: false,
  },
  overrides: {},
};
