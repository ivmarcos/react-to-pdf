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
import { openPDF, savePDF } from "./utils";

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
    const pdfRef = useRef<InstanceType<typeof jsPDF>>();
    const [blob, setBlob] = useState<URL | null>(null);
    const optionsString = JSON.stringify(options);

    const save = useCallback<PDFHandle["save"]>(async (saveOptions) => {
      savePDF(pdfRef.current, saveOptions);
    }, []);

    const open = useCallback<PDFHandle["open"]>(() => {
      openPDF(pdfRef.current);
    }, []);

    const getPDF = useCallback<PDFHandle["getPDF"]>(() => {
      return pdfRef.current;
    }, []);

    const update = useCallback<PDFHandle["update"]>(async () => {
      const pdf = await generatePDF(containerRef, {
        ...options,
        method: "build",
      });
      pdfRef.current = pdf;
      const pdfBlob = pdf.output("bloburl");
      setBlob(pdfBlob);
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
          getPDF,
        };
      },
      [update, open, save, getPDF]
    );

    const pdfPreview = useMemo<React.ReactNode | null>(() => {
      if (!preview) {
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

    return (
      <>
        {pdfPreview}
        <PreviewPortal>
          <div style={previewStyle} ref={containerRef}>
            {children}
          </div>
        </PreviewPortal>
      </>
    );
  }
);

PDF.displayName = "PDF";
