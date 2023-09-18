import { Options as Html2CanvasOptions } from "html2canvas";
import { jsPDFOptions } from "jspdf";
import React, { MutableRefObject } from "react";
import { Margin, Resolution } from "./constants";
import { Document } from "./document";

export type DetailedMargin = {
  top: Margin | number;
  right: Margin | number;
  bottom: Margin | number;
  left: Margin | number;
};

export type HorizontalAlignmentOption = "left" | "center" | "right";
export type AlignmentOption = 'top-left' | 'center-y' | 'center-x' | 'center-xy';
export type SizeOption = 'original' | 'fill-page' | 'shrink-to-fit';

interface PageConversionOptions {
  /** Margin of the page in MM, defaults to 0. */
  margin: DetailedMargin | Margin | number;
  /** Format of the page (A4, letter), defaults to A4. */
  format: jsPDFOptions["format"];
  /** Orientation of the page (portrait or landscape), defaults to `portrait`. */
  orientation: jsPDFOptions["orientation"];
}

interface CanvasConversionOptions
  extends Pick<Html2CanvasOptions, "useCORS" | "logging"> {
  /**
   * Mime type of the canvas captured from the screenshot, defaults to
   * 'image/jpeg' for better size performance.
   * See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
   */
  mimeType: "image/jpeg" | "image/png";
  /**
   * Quality ratio of the canvas captured from the screenshot
   * See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
   */
  qualityRatio: number;
}

export interface PDFOptions {
  /**
   * File name of the PDF file if the method select is `save`, which is the
   * default. Not used for the `build` and `open` methods. *
   */
  filename?: string;
  /**
   * Resolution in a scale where 1 gives a low resolution and possible blurred
   * image, 3 a medium and 10 an extreme quality. The size of the file increases
   * as the resolution is higher. Not recommended to use extreme resolution, e.g
   * '>= 10' for multiple pages otherwise this can make the browser cache hang
   * or crash, due to the size of the image generated for the PDF.
   */
  resolution: Resolution | number;
  /** Page options */
  page: PageConversionOptions;
  /** Canvas options */
  canvas: CanvasConversionOptions;
  /** Override values passed for the jsPDF document and html2canvas */
  overrides: {
    /**
     * Override the values passed for the jsPDF instance. See its docs for more details
     * in https://artskydj.github.io/jsPDF/docs/jsPDF.html.
     * */
    pdf?: Partial<jsPDFOptions>;
    /**
     * Override the values passed for the html2canvas function. See its docs
     * for more details in https://html2canvas.hertzen.com/documentation
     * */
    canvas?: Partial<Html2CanvasOptions>;
  };
  align?: AlignmentOption;
  size?: SizeOption;
}

export interface Options
  extends Omit<Partial<PDFOptions>, "page" | "canvas" | "overrides"> {
  page?: Partial<PageConversionOptions>;
  canvas?: Partial<CanvasConversionOptions>;
  overrides?: Partial<PDFOptions["overrides"]>;
  /**
   * Method that will follow to do with the PDF file. The `build` method just
   * returns the PDF instance in the invoked function `generatePDF` or `toPDF`.
   * By default is `open`.
   */
  method?: "save" | "open" | "build";
}

export interface UsePDFResult {
  /**
   * React ref of the target element
   */
  targetRef: MutableRefObject<any>;
  /**
   * Generates the pdf
   */
  toPDF: (options?: Options) => void;
}

export type TargetElementFinder<T extends HTMLElement> =
  | MutableRefObject<T | PDFHandle>
  | (() => T | null);

export interface RenderFooterHeaderProps {
  page: number;
  pages: number;
}

export interface FooterHeaderOptions {
  render: (RenderFooterHeaderProps) => React.ReactElement;
  margin: Margin | number;
  align: HorizontalAlignmentOption;
}
export interface PDFProps extends Omit<Options, "filename" | "method"> {
  /** Set the preview mode for the document.
   * - `false` (default) - component is not visible
   * - `true` or `embed` - render the embed PDF component
   * - `component` - render the component
   */
  preview?: PDFPreview;
  /** Content to be generated to the PDF document. */
  children: React.ReactNode;
  /** Loading component to display when the PDF document is being generated. For
   * example, `loading={<div>Loading...</div>}`. */
  loading?: React.ReactNode;
  footer?: Partial<FooterHeaderOptions>;
  header?: Partial<FooterHeaderOptions>;
  embedProps?: React.HTMLProps<HTMLEmbedElement>;
}

// export interface DocumentConverterOptions extends Options {
//   footer: Omit<FooterHeaderOptions, "render">,
//   header: Omit<FooterHeaderOptions, "render">
// }

export interface DocumentConverterOptions extends Options {
  footer: Omit<FooterHeaderOptions, "render">;
  header: Omit<FooterHeaderOptions, "render">;
}

export interface PDFHandle {
  /** Update the PDF document. */
  update: () => Promise<void>;
  /** Save the PDF document. */
  save: (filename?: string) => Promise<void>;
  /** Open the PDF document. */
  open: () => void;
  /** Print the PDF document. */
  print: () => void;
  /** Return the instance of the Document. */
  getDocument: () => InstanceType<typeof Document> | undefined;
}

export type PDFSaveOptions = Pick<Options, "filename">;

export type PDFPreview = boolean | "embed" | "children";
