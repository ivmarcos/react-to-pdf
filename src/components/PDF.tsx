import React, {
  CSSProperties,
  createContext,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import jsPDF from "jspdf";
import {
  PDFHandle,
  PDFProps,
  BodyProps,
  FooterHeaderProps,
  TargetElement,
  TargetOptions,
  ResolvedOptions,
} from "..";
import { PreviewPortal } from "./PreviewPortal";
import { Document } from "../document";
import { resolveOptions } from "../options";
import { renderCanvasBody } from "../body/canvas";
import { renderHtmlBody } from "../body/html";
import { stampHeaderFooter } from "../overlay/headerFooter";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { OFFSCREEN_POSITION } from "../constants";

const previewStyle: CSSProperties = {
  position: "fixed",
  left: OFFSCREEN_POSITION,
};

export const containerStyle: CSSProperties = {
  ...previewStyle,
  width: "fit-content",
};

type RegisterFooterHeader = ({
  element,
  index,
  options,
}: {
  element: HTMLDivElement;
  index: number;
  options?: FooterHeaderProps;
}) => void;

export interface PDFContextValues {
  registerTarget(
    target: HTMLElement,
    index: number,
    options?: TargetOptions
  ): void;
  registerFooter: RegisterFooterHeader;
  registerHeader: RegisterFooterHeader;
  pages: number;
}

export const PDFContext = createContext<PDFContextValues>(null);

interface FooterHeaderRef {
  element: HTMLDivElement;
  options: FooterHeaderProps;
}

async function renderBody(
  doc: InstanceType<typeof jsPDF>,
  targets: TargetElement[],
  resolved: ResolvedOptions,
  reservedTopMM: number,
  reservedBottomMM: number
): Promise<void> {
  if (resolved.engine === "html") {
    await renderHtmlBody(
      doc,
      targets,
      resolved,
      reservedTopMM,
      reservedBottomMM
    );
  } else {
    await renderCanvasBody(doc, targets, resolved);
  }
}

export const PDF = forwardRef<PDFHandle, PDFProps>(
  (
    {
      preview = false,
      children,
      loading,
      embedProps = {
        width: "100%",
        height: 400,
      },
      footer,
      header,
      ...options
    }: PDFProps,
    forwardedRef
  ) => {
    const [document, setDocument] = useState<Document | null>(null);
    const [blob, setBlob] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const targetElementsRef = useRef<TargetElement[]>([]);
    const footerRefs = useRef<Record<number, FooterHeaderRef>>({});
    const headerRefs = useRef<Record<number, FooterHeaderRef>>({});
    const isPreviewEmbed = preview === true || preview === "embed";

    const registerTarget = (
      target: HTMLElement,
      index: number,
      registerOptions?: TargetOptions
    ) => {
      targetElementsRef.current[index] = {
        element: target,
        options: registerOptions,
      };
    };

    const registerFooter: PDFContextValues["registerFooter"] = ({
      element,
      index,
      options: registerOptions,
    }) => {
      if (index === 0) {
        footerRefs.current = {};
      }
      footerRefs.current[index] = {
        element,
        options: registerOptions as FooterHeaderProps,
      };
    };

    const registerHeader: PDFContextValues["registerHeader"] = ({
      element,
      index,
      options: registerOptions,
    }) => {
      if (index === 0) {
        headerRefs.current = {};
      }
      headerRefs.current[index] = {
        element,
        options: registerOptions as FooterHeaderProps,
      };
    };

    const addFootersAndHeaders = async () => {
      if (!document) return;
      if (!footerRefs.current[0] && !headerRefs.current[0]) {
        updateEmbed();
        return;
      }
      const footerElements = Object.values(footerRefs.current).map((ref) =>
        ref.element.hasChildNodes() ? ref.element : null
      );
      const headerElements = Object.values(headerRefs.current).map((ref) =>
        ref.element.hasChildNodes() ? ref.element : null
      );
      const firstHeader = headerRefs.current[0]?.options;
      const firstFooter = footerRefs.current[0]?.options;
      const resolvedWithOverlay = resolveOptions({
        ...(options as any),
        header: firstHeader ?? (header as any),
        footer: firstFooter ?? (footer as any),
      });
      await stampHeaderFooter(document.getInstance(), {
        headerElements,
        footerElements,
        options: resolvedWithOverlay,
      });
      updateEmbed();
    };

    const createDocument = async () => {
      const resolved = resolveOptions({
        ...(options as any),
        header: header as any,
        footer: footer as any,
      });
      const doc = new jsPDF({
        format: resolved.page.format,
        orientation: resolved.page.orientation,
        unit: "mm",
        ...resolved.overrides.pdf,
      });
      const targets = targetElementsRef.current.length
        ? targetElementsRef.current
        : [{ element: containerRef.current }];

      // Reserve top/bottom space when a header/footer is configured.
      const headerReservedMM = header ? 30 : 0;
      const footerReservedMM = footer ? 20 : 0;

      await renderBody(
        doc,
        targets as TargetElement[],
        resolved,
        headerReservedMM,
        footerReservedMM
      );
      const next = new Document(doc, resolved.filename);
      setDocument(next);
      return next;
    };

    const updateEmbed = () => {
      if (!document || !isPreviewEmbed) return;
      setBlob(document.getBlobURL());
    };

    const footerComponents = useMemo(() => {
      if (!footer || !document) return null;
      const footerRender =
        "render" in (footer as any) ? (footer as any).render : footer;
      return <Footer render={footerRender} />;
    }, [document]);

    const headerComponents = useMemo(() => {
      if (!header || !document) return null;
      const headerRender =
        "render" in (header as any) ? (header as any).render : header;
      return <Header render={headerRender} />;
    }, [document]);

    const previewComponent = useMemo<React.ReactNode | null>(() => {
      if (!isPreviewEmbed) return null;
      if (!blob && loading) return loading;
      return (
        <embed src={blob ?? undefined} type="application/pdf" {...embedProps} />
      );
    }, [embedProps, preview, blob, loading]);

    const targetChildren = useMemo(() => {
      return React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<BodyProps>, {
            registerTarget,
            targetIndex: index,
          });
        }
        return child;
      });
    }, [children]);

    const bodyComponent = useMemo<React.ReactNode>(() => {
      const previewChildren = preview === "children";
      const wrapper = (
        <div
          style={previewChildren ? undefined : previewStyle}
          ref={containerRef}
        >
          {targetChildren}
        </div>
      );
      if (previewChildren) return wrapper;
      return <PreviewPortal>{wrapper}</PreviewPortal>;
    }, [preview, targetChildren]);

    useEffect(() => {
      createDocument();
    }, []);

    useEffect(() => {
      addFootersAndHeaders();
    }, [footerComponents, headerComponents]);

    useImperativeHandle(
      forwardedRef,
      () => ({
        update: async () => {
          await createDocument();
        },
        save: async (filename?: string) => {
          const currentDocument = document ?? (await createDocument());
          await currentDocument?.save(filename);
        },
        open: () => document?.open(),
        print: () => document?.print(),
        getPdf: () => document?.getInstance(),
        getDocument: () => document,
      }),
      [document]
    );

    return (
      <PDFContext.Provider
        value={{
          registerTarget,
          registerFooter,
          registerHeader,
          pages: document?.getNumberOfPages() ?? 0,
        }}
      >
        {previewComponent}
        {footerComponents}
        {headerComponents}
        {bodyComponent}
      </PDFContext.Provider>
    );
  }
);

PDF.displayName = "PDF";
