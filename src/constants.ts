import {
  AlignmentOption,
  DashCaseToUpperSnakeCase,
  ResolvedOptions,
  SizeOption,
} from "./types";

export const MM_TO_PX = 3.77952755906;
export const PREVIEW_ROOT_CLASS_NAME = "react-to-pdf--preview";
export const OFFSCREEN_POSITION = "-10000rem";

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

export const Alignment: Record<
  DashCaseToUpperSnakeCase<AlignmentOption>,
  AlignmentOption
> = {
  TOP_LEFT: "top-left",
  CENTER_Y: "center-y",
  CENTER_X: "center-x",
  CENTER_XY: "center-xy",
};

export const Size: Record<DashCaseToUpperSnakeCase<SizeOption>, SizeOption> = {
  ORIGINAL: "original",
  FILL_PAGE: "fill-page",
  SHRINK_TO_FIT: "shrink-to-fit",
};

/**
 * Fully-resolved default options. Functions inside the library receive this
 * shape after `resolveOptions` normalises user input.
 */
export const DEFAULT_OPTIONS: Readonly<ResolvedOptions> = {
  filename: undefined,
  method: "save",
  engine: "canvas",
  page: {
    margin: Margin.NONE,
    format: "A4",
    orientation: "portrait",
  },
  header: null,
  footer: null,
  canvas: {
    resolution: Resolution.MEDIUM,
    quality: 0.9,
    mimeType: "image/jpeg",
    align: Alignment.TOP_LEFT,
    size: Size.ORIGINAL,
    hooks: {},
    overrides: {
      useCORS: true,
      logging: false,
    },
  },
  html: {
    autoPaging: "text",
    fragmentScale: 2,
    overrides: {},
  },
  overrides: {
    pdf: {},
  },
};

/** Default header/footer values when consumers provide only a render function. */
export const DEFAULT_HEADER_FOOTER = {
  margin: 7,
  align: "center" as const,
};
