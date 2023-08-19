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
