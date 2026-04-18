import * as React from "react";
import * as ReactDOM from "react-dom";
import type { FooterHeaderProps, FooterHeaderRenderProps } from "../types";

/**
 * Mount a React render function once per page into detached containers so it
 * can be rasterised by the header/footer overlay pass. Returns the hosting
 * elements plus a cleanup function. Header/footer receive
 * `{ page, pages }` on each render.
 *
 * Uses `ReactDOM.render`/`unmountComponentAtNode` so the library works on
 * React 16.8+ without bundling React 18's `react-dom/client` entry.
 *
 * The hook path (`usePDF`/`generatePDF`) uses this; the `<PDF>` component
 * renders header/footer as real React children and passes their refs
 * directly, so it does not call this function.
 */
export async function renderFragmentsPerPage(
  config: FooterHeaderProps | null,
  numberOfPages: number
): Promise<{ elements: (HTMLElement | null)[]; cleanup: () => void }> {
  if (!config || numberOfPages === 0) {
    return { elements: [], cleanup: () => undefined };
  }

  const hosts: HTMLElement[] = [];

  for (let i = 1; i <= numberOfPages; i++) {
    const host = document.createElement("div");
    host.style.position = "fixed";
    host.style.left = "-10000px";
    host.style.top = "-10000px";
    host.style.pointerEvents = "none";
    document.body.appendChild(host);
    const props: FooterHeaderRenderProps = { page: i, pages: numberOfPages };
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(React.createElement(config.render as any, props), host);
    hosts.push(host);
  }

  // Let React flush before html2canvas reads the DOM.
  await new Promise((resolve) => setTimeout(resolve, 20));

  const cleanup = () => {
    hosts.forEach((host) => {
      try {
        // eslint-disable-next-line react/no-deprecated
        ReactDOM.unmountComponentAtNode(host);
      } catch {
        /* no-op */
      }
      host.remove();
    });
  };

  return { elements: hosts, cleanup };
}
