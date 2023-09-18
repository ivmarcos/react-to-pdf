import React, { useRef } from "react";
import { Margin, PDFHandle, PDF, Resolution } from "react-to-pdf";
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
        resolution={2}
        page={{ margin: Margin.MEDIUM }}
        footer={{
          render: ({ page, pages }) =>
            page === 1 ? null : (
              <div>
                {page} of {pages}
              </div>
            ),
        }}
        header={{
          render: ({ page }) => (
            <div style={{ background: "red" }}>Header {page}</div>
          ),
        }}
        width="100%"
        height="400"
        loading={<div>Loading...</div>}
      >
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <Card key={index} imageId={45} title="PDF preview example ====" />
          ))}
      </PDF>
    </Container>
  );
};
