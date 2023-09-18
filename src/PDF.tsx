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
import { update } from "cypress/types/lodash";

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
      embedProps = {
        width: '100%',
        height: 400
      },
      footer,
      header,
      ...options
    }: PDFProps,
    forwardedRef
  ) => {
    const [document, setDocument] = useState<InstanceType<typeof Document>>(null);
    const [blob, setBlob] = useState<URL | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const footerRefs = useRef<Record<number, HTMLDivElement>>({});
    const headerRefs = useRef<Record<number, HTMLDivElement>>({});
    const isPreviewEmbed = preview === true || preview === 'embed';

    const addFootersAndHeaders = async () => {
      if (!document) return;
      if (!footer && !header){
        updateEmbed();
        return;
      }
      console.log("update footer", document, footerRefs.current);
      const footerElements = Object.values(footerRefs.current).map(
        (containerElement) =>
          containerElement.hasChildNodes() ? containerElement : null
      );
      const headerElements = Object.values(headerRefs.current).map(
        (containerElement) =>
          containerElement.hasChildNodes() ? containerElement : null
      );
      const converter = new DocumentConverter({...options, footer, header});
      await converter.addFooterAndHeaderToDocument({
        document,
        footerElements,
        headerElements,
      });
      updateEmbed();
    };

    const createDocument = async () => {
      const converter = new DocumentConverter(options);
      const document = await converter.createDocument(containerRef.current);
      setDocument(document);
    };

    const updateEmbed = () => {
      if (!document || !isPreviewEmbed){
        return;
      }
      setBlob(document.getBlobURL());
    }

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

    const previewComponent = useMemo<React.ReactNode | null>(() => {
      if (!isPreviewEmbed) {
        return null;
      }
      if (!blob && loading) {
        return loading;
      }
      return (
        <embed
          src={blob ? blob.toString() : undefined}
          type="application/pdf"
          {...embedProps}
        />
      );
    }, [embedProps, preview, blob, loading]);

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
      createDocument();
    }, [children]);

    useEffect(() => {
      addFootersAndHeaders();
    }, [footerComponents, headerComponents]);

    useImperativeHandle(
      forwardedRef,
      () => {
        return {
          update: () => createDocument(),
          save: (filename?: string) => document?.save(filename),
          open: () => document?.open,
          getDocument: () => document
        };
      },
      [document]
    );

    console.log("render pdf preview", preview, previewComponent);

    return (
      <>
        {previewComponent}
        {footerComponents}
        {headerComponents}
        {bodyComponent}
      </>
    );
  }
);

PDF.displayName = "PDF";
