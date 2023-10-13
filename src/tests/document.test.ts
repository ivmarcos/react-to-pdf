/**
 * @jest-environment jsdom
 */

import { test, expect } from "@jest/globals";
import * as utils from "../utils";
import { Image } from "../converter/image";
import { parseOptions } from "../converter/documentConverter";
import { Document } from "../converter/document";

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
});
