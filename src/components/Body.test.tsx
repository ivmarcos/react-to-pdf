import { describe, test, expect } from "vitest";
import Body from "./Body";

describe("Body Component", () => {
  test("should export Body component", () => {
    expect(Body).toBeDefined();
  });

  test("Body should be a function component", () => {
    expect(typeof Body).toBe("function");
  });

  test("should have displayName", () => {
    expect(Body.displayName).toBe("Body");
  });
});
