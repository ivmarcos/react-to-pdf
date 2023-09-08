import React, { useRef } from "react";
import { Margin, PDFHandle, PDF } from "react-to-pdf";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";

export const ExamplePDFPreview = () => {
  const pdfRef = useRef<PDFHandle>();
  return (
    <Container>
      <Button onClick={() => pdfRef.current.save({ filename: "pdf-example" })}>
        Download PDF
      </Button>
      <PDF
        preview
        ref={pdfRef}
        page={{ margin: Margin.MEDIUM }}
        width="100%"
        height="400"
        loading={<div>Loading...</div>}
      >
        <Card imageId={45} title="PDF preview example" />
      </PDF>
    </Container>
  );
};
