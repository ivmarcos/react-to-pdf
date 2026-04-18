import type jsPDF from "jspdf";
import { getMargins } from "./canvas";
import type { ResolvedOptions, TargetElement } from "../types";

/**
 * Html-engine body renderer. Delegates pagination and (when
 * `autoPaging: "text"`) vectorised text to `jsPDF.doc.html()`.
 *
 * `doc.html()` reads element positions through `getBoundingClientRect()`,
 * so it does not work with elements that live inside an offscreen portal
 * (e.g. `<PDF preview="embed">`'s `position: fixed; left: -10000rem`
 * wrapper). For those cases we clone the element into a temporary host
 * at the document origin, capture, and remove the clone.
 *
 * Header/footer are handled outside this function by
 * `overlay/headerFooter.ts` — this renderer only lays down the body.
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

  const original = targets[0].element;
  const margin = getMargins(options);
  const pageWidthMM = doc.internal.pageSize.getWidth();
  const contentWidthMM = pageWidthMM - margin.left - margin.right;

  // If the target sits far to the left (offscreen portal pattern), move a
  // clone to the document origin so getBoundingClientRect sees sane
  // coordinates. When the element is already on-screen, capture it in place.
  const rect = original.getBoundingClientRect();
  const needsClone = rect.left < -1000 || rect.top < -1000;

  let captureTarget: HTMLElement = original;
  let host: HTMLElement | null = null;

  if (needsClone) {
    host = document.createElement("div");
    host.style.position = "absolute";
    host.style.left = "0";
    host.style.top = "0";
    host.style.width = `${Math.max(original.scrollWidth, 600)}px`;
    host.style.visibility = "hidden";
    host.style.pointerEvents = "none";
    host.style.zIndex = "-1";
    const clone = original.cloneNode(true) as HTMLElement;
    // Flatten the offscreen positioning from the clone's inline styles so
    // it lays out at the origin of the host.
    clone.style.position = "";
    clone.style.left = "";
    clone.style.top = "";
    host.appendChild(clone);
    document.body.appendChild(host);
    captureTarget = clone;
  }

  try {
    await new Promise<void>((resolve, reject) => {
      try {
        doc.html(captureTarget, {
          width: contentWidthMM,
          windowWidth: captureTarget.scrollWidth || 800,
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
  } finally {
    if (host) host.remove();
  }
}
