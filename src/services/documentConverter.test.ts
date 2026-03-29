import { describe, test, expect } from "vitest";
import { DocumentConverter, parseOptions } from "./documentConverter";
import { Size, Alignment } from "../constants";

describe("DocumentConverter", () => {
  describe("parseOptions", () => {
    test("should return default options when no options provided", () => {
      const options = parseOptions();

      expect(options).toBeDefined();
      expect(options.size).toBeDefined();
      expect(options.page?.orientation).toBe("portrait");
    });

    test("should merge provided options with defaults", () => {
      const options = parseOptions({
        size: Size.FILL_PAGE,
        page: {
          orientation: "landscape",
        },
      });

      expect(options.size).toBe(Size.FILL_PAGE);
      expect(options.page.orientation).toBe("landscape");
    });

    test("should handle custom filename", () => {
      const filename = "custom-document.pdf";
      const options = parseOptions({ filename });

      expect(options.filename).toBe(filename);
    });

    test("should handle align options", () => {
      const options = parseOptions({
        align: Alignment.CENTER_XY,
      });

      expect(options.align).toBe(Alignment.CENTER_XY);
    });

    test("should create instance with default options", () => {
      const converter = new DocumentConverter();
      expect(converter).toBeInstanceOf(DocumentConverter);
    });

    test("should create instance with custom options", () => {
      const customConverter = new DocumentConverter({
        size: Size.FILL_PAGE,
        page: {
          orientation: "landscape",
        },
      });

      expect(customConverter).toBeInstanceOf(DocumentConverter);
    });
  });
});
