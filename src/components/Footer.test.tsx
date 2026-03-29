import { describe, test, expect } from "vitest";
import { Footer } from "./Footer";

describe("Footer Component", () => {
  test("should be defined", () => {
    expect(Footer).toBeDefined();
  });

  test("should be a function component", () => {
    expect(typeof Footer).toBe("function");
  });
});
