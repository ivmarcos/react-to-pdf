import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
import generatePDF, { PDFProps, PDFHandle } from ".";
import { PreviewPortal } from "./PreviewPortal";
import jsPDF from "jspdf";
import { DocumentConverter, Document } from "./converter";

const previewStyle: CSSProperties = {
  position: "fixed",
  left: "-10000rem",
};

const containerStyle: CSSProperties = {
  width: "fit-content",
};

export const PDF = forwardRef<PDFHandle, PDFProps>(
  (
    {
      preview = false,
      children,
      loading,
      width,
      height,
      className,
      footer,
      header,
      ...options
    }: PDFProps,
    forwardedRef
  ) => {
    const [document, setDocument] = useState<InstanceType<typeof Document>>();
    const [blob, setBlob] = useState<URL | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const footerRefs = useRef<Record<number, HTMLDivElement>>({});
    const headerRefs = useRef<Record<number, HTMLDivElement>>({});
    // const optionsString = JSON.stringify(options);

    const save = useCallback<PDFHandle["save"]>(async (saveOptions) => {
      document.save(saveOptions.filename);
    }, []);

    const open = useCallback<PDFHandle["open"]>(() => {
      document.open();
    }, []);

    const getDocument = useCallback<PDFHandle["getDocument"]>(() => {
      return document;
    }, []);

    const updateFooterAndHeader = async () => {
      console.log("update footer", document);
      if (!document) return;
      const footerElements = Object.values(footerRefs.current).map(
        (containerElement) =>
          containerElement.hasChildNodes() ? containerElement : null
      );
      const headerElements = Object.values(headerRefs.current).map(
        (containerElement) =>
          containerElement.hasChildNodes() ? containerElement : null
      );
      const converter = new DocumentConverter(options);
      await converter.addFooterAndHeaderToDocument({
        document,
        footerElements,
        headerElements,
      });
      setBlob(document.getBlobURL());
    };

    const update = async () => {
      console.log("debug updating", preview);
      const converter = new DocumentConverter(options);
      const document = await converter.convert(containerRef.current);
      setDocument(document);
      // setBlob(document.getBlobURL());
    };

    const footerComponents = useMemo(() => {
      if (!footer || !document) return null;
      const pages = document.getNumberOfPages();
      const footers = Array(pages)
        .fill(null)
        .map((_, pageIndex) => {
          return (
            <div
              ref={(element) => (footerRefs.current[pageIndex] = element)}
              key={pageIndex}
              style={containerStyle}
            >
              {footer.render({ page: pageIndex + 1, pages })}
            </div>
          );
        });
      return <PreviewPortal>{footers}</PreviewPortal>;
    }, [document]);

    const headerComponents = useMemo(() => {
      if (!header || !document) return null;
      const pages = document.getNumberOfPages();
      const headers = Array(pages)
        .fill(null)
        .map((_, pageIndex) => {
          return (
            <div
              ref={(element) => (headerRefs.current[pageIndex] = element)}
              key={pageIndex}
              style={containerStyle}
            >
              {header.render({ page: pageIndex + 1, pages })}
            </div>
          );
        });
      return <PreviewPortal>{headers}</PreviewPortal>;
    }, [document]);

    const pdfPreview = useMemo<React.ReactNode | null>(() => {
      console.log("pdfPreview", preview, blob);
      if (!preview || preview === "component") {
        return null;
      }
      if (!blob && loading) {
        return loading;
      }
      return (
        <embed
          src={blob ? blob.toString() : undefined}
          width={width}
          height={height}
          className={className}
          type="application/pdf"
        />
      );
    }, [className, height, width, preview, blob, loading]);

    const wrapper = useMemo<React.ReactNode>(() => {
      return (
        <div style={previewStyle} ref={containerRef}>
          {children}
        </div>
      );
    }, [children]);

    const bodyComponent = useMemo<React.ReactNode>(() => {
      if (preview === "component") {
        return wrapper;
      }
      return <PreviewPortal>{wrapper}</PreviewPortal>;
    }, [preview, wrapper]);

    useEffect(() => {
      update();
    }, [children]);

    useEffect(() => {
      updateFooterAndHeader();
    }, [footerComponents, headerComponents]);

    useImperativeHandle(
      forwardedRef,
      () => {
        return {
          update,
          open,
          save,
          getDocument,
        };
      },
      [update, open, save, getDocument]
    );

    console.log("render pdf preview", preview, pdfPreview);

    return (
      <>
        {pdfPreview}
        {footerComponents}
        {headerComponents}
        {bodyComponent}
      </>
    );
  }
);

PDF.displayName = "PDF";
