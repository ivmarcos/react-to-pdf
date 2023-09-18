import { DocumentConverterOptions, PDFOptions } from "./types";

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

export enum Position {
  TOP_LEFT = "top_left",
  CENTERED_Y_AXIS = "centered_y_axis",
  CENTERED_X_AXIS = "centered_x_axis",
  CENTERED_XY_AXIS = "centered_xy_axis",
}

export enum Size {
  ORIGINAL_SIZE = "original_size",
  FILL_PAGE = "fill_page",
  SHRINK_TO_FIT = 'shrink_to_fit',
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
    qualityRatio: 1,
    useCORS: true,
    logging: false,
  },
  overrides: {},
  position: Position.TOP_LEFT,
  size: Size.ORIGINAL_SIZE,
  header: {
    margin: 7,
    position: 'center'
  },
  footer: {
    margin: 7,
    position: 'center'
  }
};
