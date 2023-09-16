import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useMemo,
} from "react";
import generatePDF, { PDFProps, PDFHandle } from ".";
import { PreviewPortal } from "./PreviewPortal";
import jsPDF from "jspdf";
import { Converter, Document } from "./converter";

const previewStyle: CSSProperties = {
  position: "fixed",
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
      ...options
    }: PDFProps,
    forwardedRef
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const documentRef = useRef<InstanceType<typeof Document>>();
    const [blob, setBlob] = useState<URL | null>(null);
    const optionsString = JSON.stringify(options);

    const save = useCallback<PDFHandle["save"]>(async (saveOptions) => {
      documentRef.current.save(saveOptions.filename)
    }, []);

    const open = useCallback<PDFHandle["open"]>(() => {
      documentRef.current.open();
    }, []);

    const getDocument = useCallback<PDFHandle["getDocument"]>(() => {
      return documentRef.current;
    }, []);

    const update = useCallback<PDFHandle["update"]>(async () => {
      console.log("debug updating", preview);
      const converter = new Converter(options)
      const document = await converter.convert(containerRef.current);
      setBlob(document.getBlobURL());
    }, [optionsString]);

    useEffect(() => {
      update();
    }, [children, update]);

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

    const pdfComponent = useMemo<React.ReactNode>(() => {
      if (preview === "component") {
        return wrapper;
      }
      return <PreviewPortal>{wrapper}</PreviewPortal>;
    }, [preview, wrapper]);

    console.log("render pdf preview", preview, pdfPreview);

    return (
      <>
        {pdfPreview}
        {pdfComponent}
      </>
    );
  }
);

PDF.displayName = "PDF";
