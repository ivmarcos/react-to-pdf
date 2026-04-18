import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

// Stub the body renderers so the tests don't try to run html2canvas /
// jsPDF.html() inside jsdom. Each stub records whether it was invoked.
const mocks = vi.hoisted(() => ({
  renderCanvasBody: vi.fn(async () => undefined),
  renderHtmlBody: vi.fn(async () => undefined),
  stampHeaderFooter: vi.fn(async () => undefined),
}));

vi.mock("../body/canvas", () => ({
  renderCanvasBody: mocks.renderCanvasBody,
  getMargins: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  getPageMaxWidth: () => 210,
  getPageMaxHeight: () => 297,
}));

vi.mock("../body/html", () => ({
  renderHtmlBody: mocks.renderHtmlBody,
}));

vi.mock("../overlay/headerFooter", () => ({
  stampHeaderFooter: mocks.stampHeaderFooter,
}));

const renderCanvasBodyMock = mocks.renderCanvasBody;
const renderHtmlBodyMock = mocks.renderHtmlBody;
const stampHeaderFooterMock = mocks.stampHeaderFooter;

// jsPDF constructor is real; the stubbed renderers never touch it beyond the
// constructor + addPage, which jsdom tolerates. `open()` needs window.open.
const openSpy = vi.fn();
Object.defineProperty(window, "open", { value: openSpy, writable: true });
// autoPrint / output("dataurlnewwindow") would also hit window; stub a jsPDF
// save/print where needed.

import { usePDF, create, open, save, print, resolveOptions } from "../index";
import generatePDF from "../index";
import { Document } from "../document";

const element = () => document.createElement("div");

describe("resolveOptions", () => {
  test("returns defaults when nothing is passed", () => {
    const out = resolveOptions();
    expect(out.engine).toBe("canvas");
    expect(out.method).toBe("save");
    expect(out.canvas.resolution).toBeGreaterThan(0);
    expect(out.header).toBeNull();
    expect(out.footer).toBeNull();
  });

  test("forwards legacy resolution to canvas.resolution", () => {
    const warnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);
    const out = resolveOptions({ resolution: 5 });
    expect(out.canvas.resolution).toBe(5);
    warnSpy.mockRestore();
  });

  test("normalises a header render fn into a FooterHeaderProps shape", () => {
    const Render = () => null as any;
    const out = resolveOptions({ header: Render });
    expect(out.header?.render).toBe(Render);
    expect(out.header?.align).toBe("center");
  });

  test("engine: html picks html config", () => {
    const out = resolveOptions({
      engine: "html",
      html: { autoPaging: "slice" },
    });
    expect(out.engine).toBe("html");
    expect(out.html.autoPaging).toBe("slice");
  });
});

describe("Document.save filename handling", () => {
  test("appends .pdf when the caller omits the extension", async () => {
    const saveMock = vi.fn();
    const fake = { save: saveMock } as any;
    const doc = new Document(fake, "no-extension");
    await doc.save();
    expect(saveMock).toHaveBeenCalledWith("no-extension.pdf", {
      returnPromise: true,
    });
  });

  test("keeps the name as-is when it already ends in .pdf", async () => {
    const saveMock = vi.fn();
    const fake = { save: saveMock } as any;
    const doc = new Document(fake, "already.pdf");
    await doc.save();
    expect(saveMock).toHaveBeenCalledWith("already.pdf", {
      returnPromise: true,
    });
  });

  test("explicit filename at call-time wins over stored", async () => {
    const saveMock = vi.fn();
    const fake = { save: saveMock } as any;
    const doc = new Document(fake, "stored.pdf");
    await doc.save("override");
    expect(saveMock).toHaveBeenCalledWith("override.pdf", {
      returnPromise: true,
    });
  });

  test("falls back to document-<timestamp>.pdf when no filename is known", async () => {
    const saveMock = vi.fn();
    const fake = { save: saveMock } as any;
    const doc = new Document(fake);
    await doc.save();
    const call = saveMock.mock.calls[0][0];
    expect(call).toMatch(/^document-\d+\.pdf$/);
  });
});

describe("create / save / open / print / generatePDF", () => {
  beforeEach(() => {
    renderCanvasBodyMock.mockClear();
    renderHtmlBodyMock.mockClear();
    stampHeaderFooterMock.mockClear();
    openSpy.mockClear();
  });

  test("create returns null and logs when target is missing", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const result = await create({ current: null } as any);
    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith("Unable to get the target element.");
    errorSpy.mockRestore();
  });

  test("create uses the canvas engine by default", async () => {
    const el = element();
    const doc = await create(() => el);
    expect(doc).toBeInstanceOf(Document);
    expect(renderCanvasBodyMock).toHaveBeenCalledTimes(1);
    expect(renderHtmlBodyMock).not.toHaveBeenCalled();
  });

  test("create routes to the html engine when engine: html", async () => {
    const el = element();
    const doc = await create(() => el, { engine: "html" });
    expect(doc).toBeInstanceOf(Document);
    expect(renderHtmlBodyMock).toHaveBeenCalledTimes(1);
    expect(renderCanvasBodyMock).not.toHaveBeenCalled();
  });

  test("reuses an existing PDFHandle via getDocument", async () => {
    const inner = { output: () => "bloburl", getNumberOfPages: () => 1 } as any;
    const handle = {
      getDocument: () => new Document(inner, "existing.pdf"),
      getPdf: () => inner,
      update: vi.fn(),
      save: vi.fn(),
      open: vi.fn(),
      print: vi.fn(),
    };
    const result = await create({ current: handle } as any);
    expect(result?.getInstance()).toBe(inner);
    expect(renderCanvasBodyMock).not.toHaveBeenCalled();
  });

  test("open triggers window.open with bloburl", async () => {
    const el = element();
    await open(() => el);
    expect(openSpy).toHaveBeenCalled();
  });

  test("save returns undefined when create fails", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const res = await save(() => null as any);
    expect(res).toBeUndefined();
    errorSpy.mockRestore();
  });

  test("print triggers autoPrint without throwing", async () => {
    const el = element();
    await expect(print(() => el)).resolves.not.toThrow();
  });

  test("generatePDF defaults to save and returns a jsPDF instance", async () => {
    const el = element();
    const instance = await generatePDF(() => el);
    expect(instance).toBeDefined();
    expect(typeof (instance as any).save).toBe("function");
  });

  test("generatePDF with method: build skips save/open", async () => {
    const el = element();
    const instance = await generatePDF(() => el, { method: "build" });
    expect(instance).toBeDefined();
  });

  test("generatePDF with method: open calls window.open", async () => {
    const el = element();
    await generatePDF(() => el, { method: "open" });
    expect(openSpy).toHaveBeenCalled();
  });
});

describe("usePDF", () => {
  let container: HTMLDivElement;
  let hookResult: ReturnType<typeof usePDF>;

  function HookConsumer({
    options,
  }: {
    options?: Parameters<typeof usePDF>[0];
  }) {
    hookResult = usePDF(options);
    return null;
  }

  beforeEach(() => {
    renderCanvasBodyMock.mockClear();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });

  test("returns a targetRef and a toPDF function", () => {
    act(() => {
      ReactDOM.render(React.createElement(HookConsumer), container);
    });
    expect(hookResult).toHaveProperty("targetRef");
    expect(typeof hookResult.toPDF).toBe("function");
    expect(hookResult.targetRef.current).toBeNull();
  });

  test("toPDF invokes the canvas body renderer when a ref target is set", async () => {
    act(() => {
      ReactDOM.render(
        React.createElement(HookConsumer, {
          options: { filename: "hook.pdf" },
        }),
        container
      );
    });
    hookResult.targetRef.current = element();
    await act(async () => {
      await hookResult.toPDF();
    });
    expect(renderCanvasBodyMock).toHaveBeenCalled();
  });

  test("toPDF switches to the html engine when options request it", async () => {
    act(() => {
      ReactDOM.render(
        React.createElement(HookConsumer, {
          options: { engine: "html" },
        }),
        container
      );
    });
    hookResult.targetRef.current = element();
    await act(async () => {
      await hookResult.toPDF();
    });
    expect(renderHtmlBodyMock).toHaveBeenCalled();
  });
});
