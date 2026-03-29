import { describe, test, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { FooterHeaderPage } from "./FooterHeaderPage";

vi.mock("./PreviewPortal", () => ({
  PreviewPortal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="preview-portal">{children}</div>
  ),
}));

describe("FooterHeaderPage Component", () => {
  test("should be defined", () => {
    expect(FooterHeaderPage).toBeDefined();
  });

  test("should be a function component", () => {
    expect(typeof FooterHeaderPage).toBe("function");
  });

  test("should have displayName set to 'FooterHeaderPage'", () => {
    expect(FooterHeaderPage.displayName).toBe("FooterHeaderPage");
  });

  test("should render inside PreviewPortal", () => {
    const registerMock = vi.fn();
    const renderMock = vi.fn(() => <span>content</span>);

    render(
      <FooterHeaderPage pages={1} register={registerMock} render={renderMock} />
    );

    expect(screen.getByTestId("preview-portal")).toBeDefined();
  });

  test("should render correct number of children based on pages prop", () => {
    const registerMock = vi.fn();
    const renderMock = vi.fn(() => <span>page</span>);

    const { container } = render(
      <FooterHeaderPage pages={3} register={registerMock} render={renderMock} />
    );

    const portal = screen.getByTestId("preview-portal");
    expect(portal.children.length).toBe(3);
  });

  test("should call render with correct page and pages for each page", () => {
    const registerMock = vi.fn();
    const renderMock = vi.fn(() => <span>content</span>);

    render(
      <FooterHeaderPage pages={3} register={registerMock} render={renderMock} />
    );

    expect(renderMock).toHaveBeenCalledTimes(3);
    expect(renderMock).toHaveBeenNthCalledWith(1, { page: 1, pages: 3 });
    expect(renderMock).toHaveBeenNthCalledWith(2, { page: 2, pages: 3 });
    expect(renderMock).toHaveBeenNthCalledWith(3, { page: 3, pages: 3 });
  });

  test("should call register with element and index for each page via ref", () => {
    const registerMock = vi.fn();
    const renderMock = vi.fn(() => <span>content</span>);

    render(
      <FooterHeaderPage pages={2} register={registerMock} render={renderMock} />
    );

    expect(registerMock).toHaveBeenCalledTimes(2);
    expect(registerMock).toHaveBeenCalledWith(
      expect.objectContaining({ element: expect.any(HTMLDivElement), index: 0 })
    );
    expect(registerMock).toHaveBeenCalledWith(
      expect.objectContaining({ element: expect.any(HTMLDivElement), index: 1 })
    );
  });
});
