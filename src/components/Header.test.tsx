import { describe, test, expect } from "vitest";
import { Header } from "./Header";

describe("Header Component", () => {
  test("should be defined", () => {
    expect(Header).toBeDefined();
  });

  test("should be a function component", () => {
    expect(typeof Header).toBe("function");
  });
});
