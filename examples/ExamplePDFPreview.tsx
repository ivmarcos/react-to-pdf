import React, { useRef } from "react";
import { Margin, PDFHandle, PDF, Resolution, mmToPX } from "react-to-pdf";
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
        page={{ margin: {
          top: 15,
          left: 15,
          right: 15,
          bottom: 15
        } }}
        canvas={{
          qualityRatio: 0.8
        }}
        size={Size.ORIGINAL_SIZE}
        position={Position.CENTERED_X_AXIS}
        footer={{
          render: ({ page, pages }) => 
           <div style={{width: mmToPX(190), display: 'flex', justifyContent: 'space-between'}}>
                <div>React to PDF - {new Date().getTime()}</div>
                <div>{page} of {pages}</div>
           </div>
          ,
          position: 'center',
        }}
        header={{
          render: ({ page }) => (
            <div style={{ background: "red" }}>Header {page}</div>
          ),
          position: 'left',
          margin: 5
        }}
        embedProps={{width: '100%', height: '400'}}
        loading={<div>Loading...</div>}
      >
        {Array(1)
          .fill(null)
          .map((_, index) => (
            // <div style={{backgroundColor: 'green', width: 10000, height: 100}} key={index}>
            //   test
            // </div>
            <Card key={index} imageId={45} title="PDF preview example" />
          ))}
      </PDF>
    </Container>
  );
};
