import React, {
  CSSProperties,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { PDFHandle, PDFProps } from ".";
import { PreviewPortal } from "./PreviewPortal";
import { Document } from "./document";
import {
  DocumentConverter,
  DocumentConverterPartialOptions,
} from "./documentConverter";

const previewStyle: CSSProperties = {
  position: "fixed",
  left: "-10000rem",
};

const containerStyle: CSSProperties = {
  ...previewStyle,
  width: "fit-content",
};

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
    const [document, setDocument] =
      useState<InstanceType<typeof Document>>(null);
    const [blob, setBlob] = useState<URL | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const footerRefs = useRef<Record<number, HTMLDivElement>>({});
    const headerRefs = useRef<Record<number, HTMLDivElement>>({});
    const isPreviewEmbed = preview === true || preview === "embed";

    const addFootersAndHeaders = async () => {
      if (!document) return;
      if (!footer && !header) {
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
      const footerOptions = "component" in footer ? footer : undefined;
      const headerOptions = "component" in header ? header : undefined;
      const converterOptions: DocumentConverterPartialOptions = {
        ...options,
        footer: footerOptions,
        header: headerOptions,
      };
      const converter = new DocumentConverter(converterOptions);
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
      if (!document || !isPreviewEmbed) {
        return;
      }
      setBlob(document.getBlobURL());
    };

    const footerComponents = useMemo(() => {
      if (!footer || !document) return null;
      const pages = document.getNumberOfPages();
      const FooterComponent = "component" in footer ? footer.component : footer;
      const footers = Array(pages)
        .fill(null)
        .map((_, pageIndex) => {
          return (
            <div
              ref={(element) => (footerRefs.current[pageIndex] = element)}
              key={pageIndex}
              style={containerStyle}
            >
              <FooterComponent page={pageIndex + 1} pages={pages} />
            </div>
          );
        });
      return <PreviewPortal>{footers}</PreviewPortal>;
    }, [document]);

    const headerComponents = useMemo(() => {
      if (!header || !document) return null;
      const pages = document.getNumberOfPages();
      const HeaderComponent = "component" in header ? header.component : header;
      const headers = Array(pages)
        .fill(null)
        .map((_, pageIndex) => {
          return (
            <div
              ref={(element) => (headerRefs.current[pageIndex] = element)}
              key={pageIndex}
              style={containerStyle}
            >
              <HeaderComponent page={pageIndex + 1} pages={pages} />
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

    const bodyComponent = useMemo<React.ReactNode>(() => {
      const previewChildren = preview === "children";
      const wrapper = (
        <div
          style={previewChildren ? undefined : previewStyle}
          ref={containerRef}
        >
          {children}
        </div>
      );
      if (previewChildren) {
        return wrapper;
      }
      return <PreviewPortal>{wrapper}</PreviewPortal>;
    }, [preview, children]);

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
          getDocument: () => document,
          print: () => document?.print(),
        };
      },
      [document]
    );

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
