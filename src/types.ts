import { Options as Html2CanvasOptions } from "html2canvas";
import type jsPDF from "jspdf";
import { jsPDFOptions } from "jspdf";
import React, { MutableRefObject } from "react";
import { Margin, Resolution } from "./constants";
import { Document } from "./document";
import { BodyProps } from "./components/Body";

export type Engine = "canvas" | "html";

export type DetailedMargin = {
  top: Margin | number;
  right: Margin | number;
  bottom: Margin | number;
  left: Margin | number;
};

export interface TargetOptions {
  startOnNewPage: boolean;
}

export interface TargetElement {
  element: HTMLElement;
  options?: TargetOptions;
}

export interface ImageCoordinates {
  x: number;
  y: number;
}

export type HorizontalAlignmentOption = "left" | "center" | "right";
export type AlignmentOption =
  | "top-left"
  | "center-y"
  | "center-x"
  | "center-xy";
export type SizeOption = "original" | "fill-page" | "shrink-to-fit";
export type PreviewOption = boolean | "embed" | "children";

export type DashCaseToUpperSnakeCase<S extends string> =
  S extends `${infer A}-${infer B}`
    ? `${Uppercase<A>}_${DashCaseToUpperSnakeCase<B>}`
    : Uppercase<S>;

export interface PageOptions {
  /** Margin of the page in mm; defaults to 0. */
  margin?: DetailedMargin | Margin | number;
  /** Format of the page, e.g. `a4`, `letter`. Defaults to `A4`. */
  format?: jsPDFOptions["format"];
  /** Orientation of the page. Defaults to `portrait`. */
  orientation?: jsPDFOptions["orientation"];
}

export interface FooterHeaderRenderProps {
  page: number;
  pages: number;
}

export interface FooterHeaderProps {
  render:
    | React.FC<FooterHeaderRenderProps>
    | ((props: FooterHeaderRenderProps) => JSX.Element);
  /** Distance in mm from the top (header) or bottom (footer) edge. */
  margin?: Margin | number;
  align?: HorizontalAlignmentOption;
}

/** Payload for canvas engine hooks. */
export interface CanvasHookPayload {
  /** The underlying jsPDF instance. */
  doc: InstanceType<typeof jsPDF>;
  /** The page number (1-indexed) the canvas is being added to. */
  page: number;
  /** Raw html2canvas canvas for this page slice. */
  canvas: HTMLCanvasElement;
  /**
   * Wrapper around the jsPDF instance with save/open/print/getBlob helpers.
   * @deprecated Use `doc` to operate on the jsPDF instance directly.
   */
  document: InstanceType<typeof Document>;
}

export interface CanvasHooks {
  beforeAddPage?(ctx: CanvasHookPayload): void | Promise<void>;
  afterAddPage?(ctx: CanvasHookPayload): void | Promise<void>;
  /** @deprecated renamed to `beforeAddPage`. */
  beforeAddCanvasToPage?(ctx: CanvasHookPayload): void | Promise<void>;
  /** @deprecated renamed to `afterAddPage`. */
  afterAddCanvasToPage?(ctx: CanvasHookPayload): void | Promise<void>;
}

export interface CanvasEngineOptions {
  /**
   * Resolution in a scale where 1 is low (possibly blurry) and higher values
   * produce sharper text at the cost of memory and file size. Defaults to 3.
   */
  resolution?: Resolution | number;
  /** JPEG quality ratio, 0..1. Defaults to 0.9. */
  quality?: number;
  /** Raster format. Defaults to `image/jpeg`. */
  mimeType?: "image/jpeg" | "image/png";
  /** How the rendered image is aligned on each page. */
  align?: AlignmentOption;
  /** How the rendered image is sized relative to the page. */
  size?: SizeOption;
  /** Hooks called around each canvas-to-page operation. */
  hooks?: CanvasHooks;
  /**
   * Low-level override values forwarded to html2canvas. Use sparingly; prefer
   * the named options above.
   */
  overrides?: Partial<Html2CanvasOptions>;
}

/** Options forwarded to jsPDF's `doc.html()` call for the body. */
export interface JsPdfHtmlPassthrough {
  autoPaging?: boolean | "text" | "slice";
  /** Any other jsPDF html() option not covered above. */
  [key: string]: unknown;
}

export interface HtmlEngineOptions {
  /** jsPDF auto-paging mode; defaults to `"text"` (vectorised). */
  autoPaging?: "text" | "slice" | false;
  /** html2canvas scale used when rasterising header/footer React components. */
  fragmentScale?: number;
  /** Pass-through overrides for jsPDF's `html()` call. */
  overrides?: Omit<
    JsPdfHtmlPassthrough,
    "x" | "y" | "width" | "margin" | "callback"
  >;
}

/**
 * Legacy option fields kept for backwards compatibility. All of these are
 * forwarded to their new homes by `resolveOptions` with a one-time
 * `console.warn` in dev.
 */
interface LegacyPDFOptions {
  /** @deprecated Use `canvas.resolution`. */
  resolution?: Resolution | number;
  /** @deprecated Use `canvas.align`. */
  align?: AlignmentOption;
  /** @deprecated Use `canvas.size`. */
  size?: SizeOption;
  /** @deprecated Use `canvas.hooks`. */
  hooks?: CanvasHooks;
  /** @deprecated Use `canvas` (mimeType/quality) and `canvas.overrides`. */
  canvas?: LegacyCanvasOptions;
}

interface LegacyCanvasOptions extends CanvasEngineOptions {
  /** @deprecated Renamed to `canvas.quality`. */
  qualityRatio?: number;
  /** @deprecated html2canvas flags — use `canvas.overrides`. */
  useCORS?: boolean;
  /** @deprecated html2canvas flags — use `canvas.overrides`. */
  logging?: boolean;
}

/**
 * Public options for `usePDF`, `generatePDF`, and friends.
 *
 * Pick an engine via `engine`:
 *  - `"canvas"` (default): screenshot-based, raster output, highest fidelity.
 *  - `"html"`: vectorised body text via `jsPDF.html()`, selectable/searchable.
 *
 * Engine-specific knobs live under `canvas` and `html`.
 */
export interface Options extends LegacyPDFOptions {
  /** Output filename for `save`/default `method`. */
  filename?: string;
  /** What happens after the PDF is built. Defaults to `"save"`. */
  method?: "save" | "open" | "build";
  /** Which rendering engine to use. Defaults to `"canvas"`. */
  engine?: Engine;
  /** Shared page geometry. */
  page?: PageOptions;
  header?: FooterHeaderProps | React.FC<FooterHeaderRenderProps>;
  footer?: FooterHeaderProps | React.FC<FooterHeaderRenderProps>;
  /** Canvas-engine-specific options (ignored when `engine === "html"`). */
  canvas?: LegacyCanvasOptions;
  /** Html-engine-specific options (ignored when `engine === "canvas"`). */
  html?: HtmlEngineOptions;
  /** Overrides forwarded straight to the jsPDF constructor. */
  overrides?: { pdf?: Partial<jsPDFOptions> };
}

/**
 * Fully-resolved options after defaults + legacy forwarding. Functions inside
 * the library operate on this canonical shape.
 */
export interface ResolvedOptions {
  filename?: string;
  method: "save" | "open" | "build";
  engine: Engine;
  page: Required<PageOptions>;
  header: FooterHeaderProps | null;
  footer: FooterHeaderProps | null;
  canvas: Required<
    Pick<
      CanvasEngineOptions,
      "resolution" | "quality" | "mimeType" | "align" | "size"
    >
  > & {
    hooks: CanvasHooks;
    overrides: Partial<Html2CanvasOptions>;
  };
  html: Required<Pick<HtmlEngineOptions, "autoPaging" | "fragmentScale">> & {
    overrides: NonNullable<HtmlEngineOptions["overrides"]>;
  };
  overrides: { pdf: Partial<jsPDFOptions> };
}

export interface UsePDFResult {
  /** Ref to attach to the element that should be captured. */
  targetRef: MutableRefObject<any>;
  /** Generate the PDF. Returns the underlying jsPDF instance. */
  toPDF: (options?: Options) => Promise<InstanceType<typeof jsPDF>>;
}

export type TargetElementFinder<T extends HTMLElement> =
  | MutableRefObject<T | PDFHandle>
  | (() => T | null);

export interface PDFProps extends Omit<Options, "filename" | "method"> {
  preview?: PreviewOption;
  children: React.ReactElement<BodyProps>[] | React.ReactNode;
  loading?: React.ReactNode;
  embedProps?: React.HTMLProps<HTMLEmbedElement>;
}

export interface PDFHandle {
  update: () => Promise<void>;
  save: (filename?: string) => Promise<void>;
  open: () => void;
  print: () => void;
  /** Return the underlying jsPDF instance. */
  getPdf: () => InstanceType<typeof jsPDF> | undefined;
  /**
   * Return the Document facade.
   * @deprecated Use `getPdf()` — the facade is scheduled for removal.
   */
  getDocument: () => InstanceType<typeof Document> | undefined;
}

export type PDFSaveOptions = Pick<Options, "filename">;

/**
 * @deprecated Alias kept to preserve backwards compatibility. Options have
 * been restructured — see `Options` for the canonical shape.
 */
export type PDFOptions = Options;

/**
 * @deprecated Internal alias. Consumers should read `ResolvedOptions` or
 * stay on the public `Options` surface.
 */
export type DocumentConverterOptions = ResolvedOptions;
