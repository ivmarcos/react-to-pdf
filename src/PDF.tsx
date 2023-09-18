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
  left: '-10000rem',
};

const containerStyle: CSSProperties ={
  width: 'fit-content'
}

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
    const containerRef = useRef<HTMLDivElement>(null);
    const documentRef = useRef<InstanceType<typeof Document>>();
    const [blob, setBlob] = useState<URL | null>(null);
    const [pages, setPages] = useState(0);
    const footerRefs = useRef<Record<number, HTMLDivElement>>({})
    const headerRefs = useRef<Record<number, HTMLDivElement>>({})
    // const optionsString = JSON.stringify(options);

    const save = useCallback<PDFHandle["save"]>(async (saveOptions) => {
      documentRef.current.save(saveOptions.filename)
    }, []);

    const open = useCallback<PDFHandle["open"]>(() => {
      documentRef.current.open();
    }, []);

    const getDocument = useCallback<PDFHandle["getDocument"]>(() => {
      return documentRef.current;
    }, []);

    const updateFooterAndHeader = async () => {
      if (!documentRef.current) return;
      const footerElements = Object.values(footerRefs.current);
      const headerElements = Object.values(headerRefs.current);
      console.log('DEBUG FOOTER ELEMENTS', footerElements, footerRefs, pages);
      const converter = new DocumentConverter(options);
      await converter.addFooterAndHeaderToDocument({document: documentRef.current, footerElements, headerElements})
      setBlob(documentRef.current.getBlobURL());
    }

    const update = async () => {
      console.log("debug updating", preview);
      const converter = new DocumentConverter(options)
      const document = await converter.convert(containerRef.current);
      setPages(document.getNumberOfPages())
      documentRef.current = document;
      // setBlob(document.getBlobURL());
    };

    useEffect(() => {
      update();
    }, [children]);

    useEffect(() => {
      updateFooterAndHeader();
    }, [pages])

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

    const footerComponents = useMemo(() => {
      console.log('render footer', pages, footer)
      if (!footer) return null;
      const footers = Array(pages).fill(null).map((_, pageIndex) => {
        return (
          <div ref={element => footerRefs.current[pageIndex] = (element)} key={pageIndex} style={containerStyle}>
            {footer.render({page: pageIndex +1, pages})}
          </div>
        )
      })
      return <PreviewPortal>{footers}</PreviewPortal>
    }, [pages])

    const headerComponents = useMemo(() => {
      console.log('render footer', pages, footer)
      if (!header) return null;
      const headers = Array(pages).fill(null).map((_, pageIndex) => {
        return (
          <div ref={element => headerRefs.current[pageIndex] = (element)} key={pageIndex} style={containerStyle}>
            {header.render({page: pageIndex +1, pages})}
          </div>
        )
      })
      return <PreviewPortal>{headers}</PreviewPortal>
    }, [pages])

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
