import React, { useRef } from "react";
import { Margin, PDFHandle, PDF, Resolution } from "react-to-pdf";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";
import { Position, Size } from "../src/constants";

export const ExamplePDFPreview = () => {
  const pdfRef = useRef<PDFHandle>();
  return (
    <Container>
      <Button onClick={() => pdfRef.current.getDocument().save("pdf-example.pdf")}>
        Download PDF
      </Button>
      <PDF
        preview
        ref={pdfRef}
        resolution={Resolution.MEDIUM}
        page={{ margin: Margin.MEDIUM }}
        size={Size.ORIGINAL_SIZE}
        // position={Position.TOP_LEFT}
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
        {Array(1)
          .fill(null)
          .map((_, index) => (
            // <div style={{backgroundColor: 'green', width: 10000, height: 100}} key={index}>
            //   test
            // </div>
            <Card key={index} imageId={45} title="PDF preview example ====" />
          ))}
      </PDF>
    </Container>
  );
};
