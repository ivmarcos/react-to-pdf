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

export const PDFViewer = forwardRef<PDFHandle, PDFProps>(
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
      console.log("debug updating", preview);
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

PDFViewer.displayName = "PDFViewer";
