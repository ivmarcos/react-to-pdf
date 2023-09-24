import React, { useRef } from "react";
import {
  Margin,
  PDFHandle,
  PDF,
  Resolution,
  mmToPX,
  save,
  print,
  FooterHeaderProps,
} from "react-to-pdf";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";
import { Alignment, Size } from "../src/constants";

const HeaderComponent = ({ page, pages }: FooterHeaderProps) => {
  return (
    <div>
      Header {page} {pages}
    </div>
  );
};

export const ExamplePDFPreview = () => {
  const pdfRef = useRef<PDFHandle>();
  const containerRef = useRef<HTMLDivElement>();
  return (
    <Container>
      <Button onClick={() => print(pdfRef)}>Download PDF</Button>
      <Button onClick={() => print(containerRef)}>Download PDF - 2</Button>
      <div ref={containerRef}>test</div>
      <PDF
        preview
        ref={pdfRef}
        resolution={Resolution.MEDIUM}
        page={{
          margin: {
            top: 15,
            left: 15,
            right: 15,
            bottom: 15,
          },
          format: "letter",
        }}
        canvas={{
          qualityRatio: 0.93,
        }}
        size="fill-page"
        align="center-x"
        footer={{
          component: ({ page, pages }) => (
            <div
              style={{
                width: mmToPX(190),
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>React to PDF - {new Date().getTime()}</div>
              <div>
                {page} of {pages}
              </div>
            </div>
          ),
          align: "center",
        }}
        // header={{
        //   render: ({ page }) => (
        //     <div style={{ background: "red" }}>Header {page}</div>
        //   ),
        //   align: "left",
        //   margin: 5,
        // }}
        header={{
          component: HeaderComponent,
          align: "left",
        }}
        embedProps={{ width: "100%", height: "400" }}
        loading={<div>Loading...</div>}
      >
        {Array(10)
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
