import { DEFAULT_HEADER_FOOTER, DEFAULT_OPTIONS } from "./constants";
import {
  CanvasHooks,
  FooterHeaderProps,
  FooterHeaderRenderProps,
  Options,
  ResolvedOptions,
} from "./types";

const warned = new Set<string>();

function warnOnce(key: string, message: string): void {
  if (warned.has(key)) return;
  warned.add(key);
  if (typeof console !== "undefined" && typeof console.warn === "function") {
    console.warn(`[react-to-pdf] ${message}`);
  }
}

function normaliseHeaderFooter(
  input: Options["header"] | Options["footer"]
): FooterHeaderProps | null {
  if (!input) return null;
  if (typeof input === "function") {
    return {
      render: input as (props: FooterHeaderRenderProps) => JSX.Element,
      margin: DEFAULT_HEADER_FOOTER.margin,
      align: DEFAULT_HEADER_FOOTER.align,
    };
  }
  return {
    render: input.render,
    margin: input.margin ?? DEFAULT_HEADER_FOOTER.margin,
    align: input.align ?? DEFAULT_HEADER_FOOTER.align,
  };
}

function normaliseHooks(
  canvasHooks: CanvasHooks | undefined,
  legacyHooks: CanvasHooks | undefined
): CanvasHooks {
  const merged: CanvasHooks = { ...(canvasHooks ?? {}) };

  if (legacyHooks) {
    for (const key of [
      "beforeAddPage",
      "afterAddPage",
      "beforeAddCanvasToPage",
      "afterAddCanvasToPage",
    ] as const) {
      if (legacyHooks[key] && !merged[key]) {
        merged[key] = legacyHooks[key];
      }
    }
    if (legacyHooks.beforeAddCanvasToPage || legacyHooks.afterAddCanvasToPage) {
      warnOnce(
        "hooks-rename",
        "`hooks.beforeAddCanvasToPage` / `hooks.afterAddCanvasToPage` are deprecated. Use `canvas.hooks.beforeAddPage` / `canvas.hooks.afterAddPage`."
      );
    }
  }

  // Forward legacy *CanvasToPage names to new names when the new ones aren't set.
  if (!merged.beforeAddPage && merged.beforeAddCanvasToPage) {
    merged.beforeAddPage = merged.beforeAddCanvasToPage;
  }
  if (!merged.afterAddPage && merged.afterAddCanvasToPage) {
    merged.afterAddPage = merged.afterAddCanvasToPage;
  }
  // Mirror new → old so any code still reading the deprecated keys works.
  if (!merged.beforeAddCanvasToPage && merged.beforeAddPage) {
    merged.beforeAddCanvasToPage = merged.beforeAddPage;
  }
  if (!merged.afterAddCanvasToPage && merged.afterAddPage) {
    merged.afterAddCanvasToPage = merged.afterAddPage;
  }

  return merged;
}

/**
 * Normalise user-supplied options: apply defaults, forward legacy top-level
 * keys into their new homes, and return a canonical `ResolvedOptions` that
 * library internals can consume directly.
 */
export function resolveOptions(input?: Options): ResolvedOptions {
  const opts = input ?? {};

  // Legacy fields → new homes, with a one-time warn per field.
  const legacyCanvas = opts.canvas ?? {};
  if (opts.resolution !== undefined) {
    warnOnce(
      "opts-resolution",
      "`options.resolution` is deprecated. Use `options.canvas.resolution`."
    );
  }
  if (opts.align !== undefined) {
    warnOnce(
      "opts-align",
      "`options.align` is deprecated. Use `options.canvas.align`."
    );
  }
  if (opts.size !== undefined) {
    warnOnce(
      "opts-size",
      "`options.size` is deprecated. Use `options.canvas.size`."
    );
  }
  if (legacyCanvas.qualityRatio !== undefined) {
    warnOnce(
      "opts-qualityRatio",
      "`options.canvas.qualityRatio` is deprecated. Use `options.canvas.quality`."
    );
  }

  const overrides: Partial<import("html2canvas").Options> = {
    ...DEFAULT_OPTIONS.canvas.overrides,
    ...legacyCanvas.overrides,
  };
  if (legacyCanvas.useCORS !== undefined) {
    overrides.useCORS = legacyCanvas.useCORS;
  }
  if (legacyCanvas.logging !== undefined) {
    overrides.logging = legacyCanvas.logging;
  }

  const canvas = {
    resolution:
      legacyCanvas.resolution ??
      opts.resolution ??
      DEFAULT_OPTIONS.canvas.resolution,
    quality:
      legacyCanvas.quality ??
      legacyCanvas.qualityRatio ??
      DEFAULT_OPTIONS.canvas.quality,
    mimeType: legacyCanvas.mimeType ?? DEFAULT_OPTIONS.canvas.mimeType,
    align: legacyCanvas.align ?? opts.align ?? DEFAULT_OPTIONS.canvas.align,
    size: legacyCanvas.size ?? opts.size ?? DEFAULT_OPTIONS.canvas.size,
    hooks: normaliseHooks(legacyCanvas.hooks, opts.hooks),
    overrides,
  };

  const html = {
    autoPaging: opts.html?.autoPaging ?? DEFAULT_OPTIONS.html.autoPaging,
    fragmentScale:
      opts.html?.fragmentScale ?? DEFAULT_OPTIONS.html.fragmentScale,
    overrides: opts.html?.overrides ?? {},
  };

  const page = {
    margin: opts.page?.margin ?? DEFAULT_OPTIONS.page.margin,
    format: opts.page?.format ?? DEFAULT_OPTIONS.page.format,
    orientation: opts.page?.orientation ?? DEFAULT_OPTIONS.page.orientation,
  };

  const engine = opts.engine ?? DEFAULT_OPTIONS.engine;

  if (engine === "html" && hasCanvasSpecificKeys(opts)) {
    warnOnce(
      "engine-html-canvas-keys",
      '`engine: "html"` is set but canvas-only options (resolution/align/size) were provided. They\'ll be ignored.'
    );
  }

  return {
    filename: opts.filename,
    method: opts.method ?? DEFAULT_OPTIONS.method,
    engine,
    page,
    header: normaliseHeaderFooter(opts.header),
    footer: normaliseHeaderFooter(opts.footer),
    canvas,
    html,
    overrides: {
      pdf: opts.overrides?.pdf ?? {},
    },
  };
}

function hasCanvasSpecificKeys(opts: Options): boolean {
  return (
    opts.resolution !== undefined ||
    opts.align !== undefined ||
    opts.size !== undefined ||
    opts.hooks !== undefined ||
    (opts.canvas !== undefined &&
      (opts.canvas.resolution !== undefined ||
        opts.canvas.align !== undefined ||
        opts.canvas.size !== undefined ||
        opts.canvas.hooks !== undefined))
  );
}

/** For tests: reset the one-time deprecation warning cache. */
export function resetOptionWarnings(): void {
  warned.clear();
}
