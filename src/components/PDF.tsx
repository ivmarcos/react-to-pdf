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
import {
  PDFHandle,
  PDFProps,
  BodyProps,
  FooterHeaderProps,
  TargetElement,
  TargetOptions,
} from "..";
import { PreviewPortal } from "./PreviewPortal";
import { Document } from "../models/document";
import {
  DocumentConverter,
  DocumentConverterPartialOptions,
} from "../services/documentConverter";
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
  registerTarget(target: HTMLElement, options?: TargetOptions): void;
  registerFooter: RegisterFooterHeader;
  registerHeader: RegisterFooterHeader;
  pages: number;
}

export const PDFContext = createContext<PDFContextValues>(null);

interface FooterHeaderRef {
  element: HTMLDivElement;
  options: FooterHeaderProps;
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
    const [document, setDocument] =
      useState<InstanceType<typeof Document>>(null);
    const [blob, setBlob] = useState<URL | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const targetElementsRef = useRef<TargetElement[]>([]);
    const footerRefs = useRef<Record<number, FooterHeaderRef>>({});
    const headerRefs = useRef<Record<number, FooterHeaderRef>>({});
    const isPreviewEmbed = preview === true || preview === "embed";

    const registerTarget = (
      target: HTMLElement,
      index,
      options?: TargetOptions
    ) => {
      targetElementsRef.current[index] = {
        element: target,
        options,
      };
    };

    const registerFooter: PDFContextValues["registerFooter"] = ({
      element,
      index,
      options,
    }) => {
      if (index === 0) {
        footerRefs.current = {};
      }
      footerRefs.current[index] = {
        element,
        options,
      };
    };

    const registerHeader: PDFContextValues["registerHeader"] = ({
      element,
      index,
      options,
    }) => {
      if (index === 0) {
        headerRefs.current = {};
      }
      headerRefs.current[index] = {
        element,
        options,
      };
    };

    const addFootersAndHeaders = async () => {
      if (!document) return;
      if (!footerRefs.current[0] && !headerRefs.current[0]) {
        updateEmbed();
        return;
      }
      const footerElements = Object.values(footerRefs.current).map(
        (footerRef) =>
          footerRef.element.hasChildNodes() ? footerRef.element : null
      );
      const headerElements = Object.values(headerRefs.current).map(
        (headerRef) =>
          headerRef.element.hasChildNodes() ? headerRef.element : null
      );
      const footerOptions = footerRefs.current[0].options;
      const headerOptions = headerRefs.current[0].options;
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
      const targets = targetElementsRef.current.length
        ? targetElementsRef.current
        : [{ element: containerRef.current }];
      const document = await converter.createDocumentAdvanced(targets);
      setDocument(document);
      return document;
    };

    const updateEmbed = () => {
      if (!document || !isPreviewEmbed) {
        return;
      }
      setBlob(document.getBlobURL());
    };

    const footerComponents = useMemo(() => {
      if (!footer || !document) return null;
      const footerRender = "render" in footer ? footer.render : footer;
      return <Footer render={footerRender} />;
    }, [document]);

    const headerComponents = useMemo(() => {
      if (!header || !document) return null;
      const headerRender = "render" in header ? header.render : header;
      return <Header render={headerRender} />;
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
      if (previewChildren) {
        return wrapper;
      }
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
      () => {
        return {
          update: async () => {
            await createDocument();
          },
          save: async (filename?: string) => {
            const currentDocument = document
              ? document
              : await createDocument();
            currentDocument?.save(filename);
          },
          open: () => document?.open(),
          getDocument: () => document,
          print: () => document?.print(),
        };
      },
      [document]
    );

    return (
      <PDFContext.Provider
        value={{
          registerTarget,
          registerFooter,
          registerHeader,
          pages: document?.getNumberOfPages(),
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
