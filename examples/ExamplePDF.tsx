import React, { useRef } from "react";
import { Margin, PDFHandle, PDF } from "react-to-pdf";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";

export const ExamplePDF = () => {
  const pdfRef = useRef<PDFHandle>();
  return (
    <Container>
      <Button onClick={() => pdfRef.current.save({ filename: "pdf-example" })}>
        Download PDF
      </Button>
      <PDF ref={pdfRef} page={{ margin: Margin.MEDIUM }}>
        <Card imageId={50} title="PDF example" />
      </PDF>
    </Container>
  );
};
