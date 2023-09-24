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
import { PDFHandle, PDFProps, TargetProps } from ".";
import { PreviewPortal } from "./PreviewPortal";
import { Document } from "./document";
import {
  DocumentConverter,
  DocumentConverterPartialOptions,
  TargetElement,
  TargetOptions,
} from "./documentConverter";
import { log } from "./testUtils";

const previewStyle: CSSProperties = {
  position: "fixed",
  left: "-10000rem",
};

const containerStyle: CSSProperties = {
  ...previewStyle,
  width: "fit-content",
};

export interface PDFContextValues {
  registerTarget(target: HTMLElement, options?: TargetOptions):void
}

export const PDFContext = createContext<PDFContextValues>(null);

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
    const targetElementsRef = useRef<TargetElement[]>([]);
    const footerRefs = useRef<Record<number, HTMLDivElement>>({});
    const headerRefs = useRef<Record<number, HTMLDivElement>>({});
    const isPreviewEmbed = preview === true || preview === "embed";

    const registerTarget = (target: HTMLElement, index, options?: TargetOptions) => {
      targetElementsRef.current[index] = {
        element: target,
        options
      }
      // targetElementsRef.current.push({
      //   element: target,
      //   options
      // });
    }

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
      const footerOptions =
        footer && "component" in footer ? footer : undefined;
      const headerOptions =
        header && "component" in header ? header : undefined;
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
      // const element = targetElementsRef.current.length ? targetElementsRef.current[0] : containerRef.current;
      const targets = targetElementsRef.current.length ? targetElementsRef.current : [{element: containerRef.current}]
      console.log('debug targets', targets)
      const document = await converter.createDocumentAdvanced(targets);
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

    const targetChildren = useMemo(() => {
      return React.Children.map(children, (child, index) => {
        // Checking isValidElement is the safe way and avoids a
        // typescript error too.
        log('PDF', child?.type)

        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<TargetProps>, {registerTarget, targetIndex: index});
        }
        return child;
      });
    }, [children])

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
      if (previewChildren) {
        return wrapper;
      }
      return <PreviewPortal>{wrapper}</PreviewPortal>;
    }, [preview, targetChildren]);

    

    useEffect(() => {
      createDocument();
    }, [targetChildren]);

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
      <PDFContext.Provider value={{registerTarget}}>
        {previewComponent}
        {footerComponents}
        {headerComponents}
        {bodyComponent}
      </PDFContext.Provider>
    );
  }
);

PDF.displayName = "PDF";
