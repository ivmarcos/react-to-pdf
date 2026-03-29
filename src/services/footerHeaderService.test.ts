import { describe, test, expect, vi } from "vitest";
import { FooterHeaderService } from "./footerHeaderService";
import { Document } from "../models/document";
import { Image } from "../models/image";
import { DEFAULT_OPTIONS } from "../constants";

describe("FooterHeaderService", () => {
  test("should create service with options", () => {
    const service = new FooterHeaderService(DEFAULT_OPTIONS);
    expect(service).toBeDefined();
  });

  test("should handle empty footer and header elements", async () => {
    const service = new FooterHeaderService(DEFAULT_OPTIONS);
    const document = new Document(DEFAULT_OPTIONS);

    const result = await service.addFooterAndHeaderToDocument({
      document,
      footerElements: [],
      headerElements: [],
    });

    expect(result).toBe(document);
    expect(document.getNumberOfPages()).toBe(1);
  });

  test("should return document when processing elements", async () => {
    const service = new FooterHeaderService(DEFAULT_OPTIONS);
    const document = new Document(DEFAULT_OPTIONS);

    // Test with null elements (common edge case)
    const result = await service.addFooterAndHeaderToDocument({
      document,
      footerElements: [null as any],
      headerElements: [null as any],
    });

    expect(result).toBe(document);
    expect(result).toBeInstanceOf(Document);
  });

  test("should return document instance", async () => {
    const service = new FooterHeaderService(DEFAULT_OPTIONS);
    const document = new Document(DEFAULT_OPTIONS);

    const result = await service.addFooterAndHeaderToDocument({
      document,
      footerElements: [],
      headerElements: [],
    });

    expect(result).toBeInstanceOf(Document);
  });
});
