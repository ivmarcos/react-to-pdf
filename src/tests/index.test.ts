import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

// Mock DocumentConverter before importing the module under test
const mockCreateDocument = vi.fn();

vi.mock("../services/documentConverter", () => ({
  DocumentConverter: vi.fn().mockImplementation(() => ({
    createDocument: mockCreateDocument,
  })),
  parseOptions: vi.fn(),
}));

import { usePDF, create, open, save, print } from "../index";
import generatePDF from "../index";

// Helper to build a mock Document returned by DocumentConverter.createDocument
const createMockDocument = () => ({
  save: vi.fn().mockResolvedValue(undefined),
  open: vi.fn(),
  print: vi.fn(),
  getInstance: vi.fn().mockReturnValue({ fake: "jsPDF" }),
});

describe("getTargetElementOrPDFHandle (tested via create)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns null and logs error when ref.current is null", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const ref = { current: null };
    const result = await create(ref as any);
    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith("Unable to get the target element.");
    errorSpy.mockRestore();
  });

  test("returns null and logs error when ref is undefined", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const ref = { current: undefined };
    const result = await create(ref as any);
    expect(result).toBeNull();
    errorSpy.mockRestore();
  });

  test("returns null and logs error when getter returns null", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const getter = () => null;
    const result = await create(getter);
    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith("Unable to get the target element.");
    errorSpy.mockRestore();
  });

  test("resolves element from getter function", async () => {
    const mockDoc = createMockDocument();
    mockCreateDocument.mockResolvedValue(mockDoc);
    const element = document.createElement("div");
    const getter = () => element;
    const result = await create(getter);
    expect(result).toBe(mockDoc);
    expect(mockCreateDocument).toHaveBeenCalledWith(element);
  });

  test("resolves element from ref object", async () => {
    const mockDoc = createMockDocument();
    mockCreateDocument.mockResolvedValue(mockDoc);
    const element = document.createElement("div");
    const ref = { current: element };
    const result = await create(ref as any);
    expect(result).toBe(mockDoc);
    expect(mockCreateDocument).toHaveBeenCalledWith(element);
  });
});

describe("create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("uses PDFHandle.getDocument when element has getDocument", async () => {
    const mockDoc = createMockDocument();
    const pdfHandle = {
      getDocument: vi.fn().mockReturnValue(mockDoc),
      update: vi.fn(),
      save: vi.fn(),
      open: vi.fn(),
      print: vi.fn(),
    };
    const ref = { current: pdfHandle };
    const result = await create(ref as any);
    expect(pdfHandle.getDocument).toHaveBeenCalled();
    expect(result).toBe(mockDoc);
    expect(mockCreateDocument).not.toHaveBeenCalled();
  });

  test("passes options to DocumentConverter", async () => {
    const { DocumentConverter } = await import("../services/documentConverter");
    const mockDoc = createMockDocument();
    mockCreateDocument.mockResolvedValue(mockDoc);
    const element = document.createElement("div");
    const options = { filename: "test.pdf" };
    await create(() => element, options);
    expect(DocumentConverter).toHaveBeenCalledWith(options);
  });

  test("propagates errors from createDocument", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const error = new Error("conversion failed");
    mockCreateDocument.mockRejectedValue(error);
    const element = document.createElement("div");
    await expect(create(() => element)).rejects.toThrow("conversion failed");
    expect(errorSpy).toHaveBeenCalledWith(
      "Failed to create PDF document:",
      error
    );
    errorSpy.mockRestore();
  });
});

describe("open", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("creates document and calls open on it", async () => {
    const mockDoc = createMockDocument();
    mockCreateDocument.mockResolvedValue(mockDoc);
    const element = document.createElement("div");
    await open(() => element);
    expect(mockDoc.open).toHaveBeenCalled();
  });

  test("does not throw when element is null", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    await open(() => null);
    // create returns null, document?.open() is safe
    errorSpy.mockRestore();
  });

  test("propagates errors from create", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mockCreateDocument.mockRejectedValue(new Error("open error"));
    const element = document.createElement("div");
    await expect(open(() => element)).rejects.toThrow("open error");
    errorSpy.mockRestore();
  });
});

describe("save", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("creates document and calls save on it", async () => {
    const mockDoc = createMockDocument();
    mockCreateDocument.mockResolvedValue(mockDoc);
    const element = document.createElement("div");
    await save(() => element);
    expect(mockDoc.save).toHaveBeenCalled();
  });

  test("does not throw when element is null", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    await save(() => null);
    errorSpy.mockRestore();
  });

  test("propagates errors from create", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mockCreateDocument.mockRejectedValue(new Error("save error"));
    const element = document.createElement("div");
    await expect(save(() => element)).rejects.toThrow("save error");
    errorSpy.mockRestore();
  });
});

describe("print", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("creates document and calls print on it", async () => {
    const mockDoc = createMockDocument();
    mockCreateDocument.mockResolvedValue(mockDoc);
    const element = document.createElement("div");
    await print(() => element);
    expect(mockDoc.print).toHaveBeenCalled();
  });

  test("does not throw when element is null", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    await print(() => null);
    errorSpy.mockRestore();
  });
});

describe("generatePDF (default export)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("defaults to save method and returns jsPDF instance", async () => {
    const mockDoc = createMockDocument();
    mockCreateDocument.mockResolvedValue(mockDoc);
    const element = document.createElement("div");
    const result = await generatePDF(() => element);
    expect(mockDoc.save).toHaveBeenCalled();
    expect(mockDoc.getInstance).toHaveBeenCalled();
    expect(result).toEqual({ fake: "jsPDF" });
  });

  test("save method calls save and returns instance", async () => {
    const mockDoc = createMockDocument();
    mockCreateDocument.mockResolvedValue(mockDoc);
    const element = document.createElement("div");
    const result = await generatePDF(() => element, { method: "save" });
    expect(mockDoc.save).toHaveBeenCalled();
    expect(result).toEqual({ fake: "jsPDF" });
  });

  test("open method calls open and returns instance", async () => {
    const mockDoc = createMockDocument();
    mockCreateDocument.mockResolvedValue(mockDoc);
    const element = document.createElement("div");
    const result = await generatePDF(() => element, { method: "open" });
    expect(mockDoc.open).toHaveBeenCalled();
    expect(mockDoc.save).not.toHaveBeenCalled();
    expect(result).toEqual({ fake: "jsPDF" });
  });

  test("build method returns instance without save or open", async () => {
    const mockDoc = createMockDocument();
    mockCreateDocument.mockResolvedValue(mockDoc);
    const element = document.createElement("div");
    const result = await generatePDF(() => element, { method: "build" });
    expect(mockDoc.save).not.toHaveBeenCalled();
    expect(mockDoc.open).not.toHaveBeenCalled();
    expect(result).toEqual({ fake: "jsPDF" });
  });

  test("propagates errors", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mockCreateDocument.mockRejectedValue(new Error("generate error"));
    const element = document.createElement("div");
    await expect(generatePDF(() => element)).rejects.toThrow("generate error");
    errorSpy.mockRestore();
  });
});

describe("usePDF", () => {
  let container: HTMLDivElement;
  // Stores the latest hook result so tests can inspect it
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
    vi.clearAllMocks();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });

  test("returns targetRef and toPDF function", () => {
    act(() => {
      ReactDOM.render(React.createElement(HookConsumer), container);
    });
    expect(hookResult).toHaveProperty("targetRef");
    expect(hookResult).toHaveProperty("toPDF");
    expect(typeof hookResult.toPDF).toBe("function");
    expect(hookResult.targetRef.current).toBeNull();
  });

  test("returns stable references across re-renders", () => {
    act(() => {
      ReactDOM.render(
        React.createElement(HookConsumer, {
          options: { filename: "test.pdf" },
        }),
        container
      );
    });
    const first = { ...hookResult };
    act(() => {
      ReactDOM.render(
        React.createElement(HookConsumer, {
          options: { filename: "test.pdf" },
        }),
        container
      );
    });
    expect(hookResult.targetRef).toBe(first.targetRef);
  });

  test("toPDF calls generatePDF with targetRef and hook options", async () => {
    const mockDoc = createMockDocument();
    mockCreateDocument.mockResolvedValue(mockDoc);
    const element = document.createElement("div");

    act(() => {
      ReactDOM.render(
        React.createElement(HookConsumer, {
          options: { filename: "hook-options.pdf" },
        }),
        container
      );
    });
    hookResult.targetRef.current = element;

    await act(async () => {
      await hookResult.toPDF();
    });
    expect(mockCreateDocument).toHaveBeenCalledWith(element);
  });

  test("hook options take precedence over toPDF options", async () => {
    const { DocumentConverter } = await import("../services/documentConverter");
    const mockDoc = createMockDocument();
    mockCreateDocument.mockResolvedValue(mockDoc);
    const element = document.createElement("div");

    act(() => {
      ReactDOM.render(
        React.createElement(HookConsumer, {
          options: { filename: "hook-level.pdf" },
        }),
        container
      );
    });
    hookResult.targetRef.current = element;

    await act(async () => {
      await hookResult.toPDF({ filename: "call-level.pdf" });
    });
    // usePDFoptions ?? toPDFoptions means hook options win when defined
    expect(DocumentConverter).toHaveBeenCalledWith(
      expect.objectContaining({ filename: "hook-level.pdf" })
    );
  });

  test("toPDF options are used when hook options are undefined", async () => {
    const { DocumentConverter } = await import("../services/documentConverter");
    const mockDoc = createMockDocument();
    mockCreateDocument.mockResolvedValue(mockDoc);
    const element = document.createElement("div");

    act(() => {
      ReactDOM.render(React.createElement(HookConsumer), container);
    });
    hookResult.targetRef.current = element;

    await act(async () => {
      await hookResult.toPDF({ filename: "fallback.pdf" });
    });
    expect(DocumentConverter).toHaveBeenCalledWith(
      expect.objectContaining({ filename: "fallback.pdf" })
    );
  });
});
