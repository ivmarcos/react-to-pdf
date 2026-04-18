import type jsPDF from "jspdf";
import { getMargins } from "./canvas";
import type { ResolvedOptions, TargetElement } from "../types";

/**
 * Html-engine body renderer. Delegates pagination and (when
 * `autoPaging: "text"`) vectorised text to `jsPDF.doc.html()`.
 *
 * Header/footer are handled outside this function by
 * `overlay/headerFooter.ts` — this renderer only lays down the body and
 * reserves the right top/bottom margin for them.
 */
export async function renderHtmlBody(
  doc: InstanceType<typeof jsPDF>,
  targets: TargetElement[],
  options: ResolvedOptions,
  reservedTopMM = 0,
  reservedBottomMM = 0
): Promise<void> {
  if (targets.length === 0) return;
  if (targets.length > 1) {
    throw new Error(
      'react-to-pdf: the "html" engine only supports a single body element. ' +
        "Wrap multiple bodies in a container or switch to the canvas engine."
    );
  }

  const body = targets[0].element;
  const margin = getMargins(options);
  const pageWidthMM = doc.internal.pageSize.getWidth();
  const contentWidthMM = pageWidthMM - margin.left - margin.right;

  await new Promise<void>((resolve, reject) => {
    try {
      doc.html(body, {
        x: margin.left,
        y: margin.top + reservedTopMM,
        width: contentWidthMM,
        windowWidth: body.scrollWidth || 800,
        margin: [
          margin.top + reservedTopMM,
          margin.right,
          margin.bottom + reservedBottomMM,
          margin.left,
        ],
        autoPaging: options.html.autoPaging,
        ...options.html.overrides,
        callback: () => resolve(),
      });
    } catch (err) {
      reject(err);
    }
  });
}
