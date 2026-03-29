import { describe, test, expect, vi } from "vitest";
import { parseOptions } from "../services/documentConverter";
import { Document } from "../models/document";

describe("Document", () => {
  test("should create a new document", () => {
    const options = parseOptions();
    const document = new Document(options);
    expect(document).toBeTruthy();
  });

  test("should add a new page", () => {
    const options = parseOptions();
    const document = new Document(options);
    document.addPage();
    expect(document.getNumberOfPages()).toBe(2);
  });

  describe("margin getters with scalar margin", () => {
    test("all margins should return the same scalar value", () => {
      const options = parseOptions({ page: { margin: 15 } });
      const document = new Document(options);
      expect(document.getMarginTop()).toBe(15);
      expect(document.getMarginRight()).toBe(15);
      expect(document.getMarginBottom()).toBe(15);
      expect(document.getMarginLeft()).toBe(15);
    });
  });

  describe("margin getters with object margin", () => {
    test("each side should return its own value", () => {
      const options = parseOptions({
        page: { margin: { top: 10, right: 5, bottom: 15, left: 20 } },
      });
      const document = new Document(options);
      expect(document.getMarginTop()).toBe(10);
      expect(document.getMarginRight()).toBe(5);
      expect(document.getMarginBottom()).toBe(15);
      expect(document.getMarginLeft()).toBe(20);
    });
  });

  describe("margin caching", () => {
    test("second call should return cached value", () => {
      const options = parseOptions({
        page: { margin: { top: 10, right: 5, bottom: 15, left: 20 } },
      });
      const document = new Document(options);

      const firstTop = document.getMarginTop();
      const secondTop = document.getMarginTop();
      expect(firstTop).toBe(secondTop);
      expect(firstTop).toBe(10);

      const firstLeft = document.getMarginLeft();
      const secondLeft = document.getMarginLeft();
      expect(firstLeft).toBe(secondLeft);
      expect(firstLeft).toBe(20);
    });

    test("cached value persists even if options are mutated", () => {
      const options = parseOptions({
        page: { margin: { top: 10, right: 5, bottom: 15, left: 20 } },
      });
      const document = new Document(options);

      expect(document.getMarginTop()).toBe(10);
      // Mutate the options after caching
      (options.page.margin as any).top = 999;
      // Should still return cached value
      expect(document.getMarginTop()).toBe(10);
    });
  });

  describe("page dimensions", () => {
    test("getPageWidth should return a valid number", () => {
      const options = parseOptions();
      const document = new Document(options);
      const width = document.getPageWidth();
      expect(typeof width).toBe("number");
      expect(width).toBeGreaterThan(0);
    });

    test("getPageHeight should return a valid number", () => {
      const options = parseOptions();
      const document = new Document(options);
      const height = document.getPageHeight();
      expect(typeof height).toBe("number");
      expect(height).toBeGreaterThan(0);
    });

    test("getPageMaxWidth should be pageWidth minus left and right margins", () => {
      const options = parseOptions({
        page: { margin: { top: 10, right: 5, bottom: 15, left: 20 } },
      });
      const document = new Document(options);
      const expected =
        document.getPageWidth() -
        (document.getMarginLeft() + document.getMarginRight());
      expect(document.getPageMaxWidth()).toBe(expected);
    });

    test("getPageMaxHeight should be pageHeight minus top and bottom margins", () => {
      const options = parseOptions({
        page: { margin: { top: 10, right: 5, bottom: 15, left: 20 } },
      });
      const document = new Document(options);
      const expected =
        document.getPageHeight() -
        (document.getMarginTop() + document.getMarginBottom());
      expect(document.getPageMaxHeight()).toBe(expected);
    });

    test("getPageMaxWidth with zero margin equals getPageWidth", () => {
      const options = parseOptions({ page: { margin: 0 } });
      const document = new Document(options);
      expect(document.getPageMaxWidth()).toBe(document.getPageWidth());
    });

    test("getPageMaxHeight with zero margin equals getPageHeight", () => {
      const options = parseOptions({ page: { margin: 0 } });
      const document = new Document(options);
      expect(document.getPageMaxHeight()).toBe(document.getPageHeight());
    });
  });

  describe("addCanvasToPage", () => {
    test("should add canvas image data to the document", async () => {
      const options = parseOptions();
      const document = new Document(options);

      const canvas = window.document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const toDataURLSpy = vi
        .spyOn(canvas, "toDataURL")
        .mockReturnValue("data:image/jpeg;base64,mockdata");

      const addImageSpy = vi
        .spyOn(document.getInstance(), "addImage")
        .mockImplementation(() => document.getInstance());
      const setPageSpy = vi.spyOn(document.getInstance(), "setPage");

      await document.addCanvasToPage({
        canvas,
        page: 1,
        width: 50,
        height: 80,
        x: 10,
        y: 20,
      });

      expect(toDataURLSpy).toHaveBeenCalledWith("image/jpeg", 0.9);
      expect(setPageSpy).toHaveBeenCalledWith(1);
      expect(addImageSpy).toHaveBeenCalledWith({
        imageData: "data:image/jpeg;base64,mockdata",
        width: 50,
        height: 80,
        x: 10,
        y: 20,
      });
    });
  });

  describe("save", () => {
    test("should call jsPDF save with default filename", async () => {
      const options = parseOptions();
      const document = new Document(options);
      const saveSpy = vi
        .spyOn(document.getInstance(), "save")
        .mockResolvedValue(undefined as any);

      await document.save();

      expect(saveSpy).toHaveBeenCalledWith(expect.any(String), {
        returnPromise: true,
      });
    });

    test("should call jsPDF save with provided filename", async () => {
      const options = parseOptions();
      const document = new Document(options);
      const saveSpy = vi
        .spyOn(document.getInstance(), "save")
        .mockResolvedValue(undefined as any);

      await document.save("my-file.pdf");

      expect(saveSpy).toHaveBeenCalledWith("my-file.pdf", {
        returnPromise: true,
      });
    });
  });

  describe("getInstance", () => {
    test("should return the jsPDF instance", () => {
      const options = parseOptions();
      const document = new Document(options);
      const instance = document.getInstance();
      expect(instance).toBeTruthy();
      expect(typeof instance.addPage).toBe("function");
      expect(typeof instance.save).toBe("function");
    });
  });

  describe("getBlob", () => {
    test("should return a Blob with application/pdf type", () => {
      const options = parseOptions();
      const document = new Document(options);
      const blob = document.getBlob();
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("application/pdf");
    });
  });

  describe("getBlobURL", () => {
    test("should call jsPDF output with bloburl", () => {
      const options = parseOptions();
      const document = new Document(options);
      const outputSpy = vi
        .spyOn(document.getInstance(), "output")
        .mockReturnValue("blob:http://localhost/fake-url" as any);
      const url = document.getBlobURL();
      expect(outputSpy).toHaveBeenCalledWith("bloburl");
      expect(typeof url).toBe("string");
    });
  });
});
