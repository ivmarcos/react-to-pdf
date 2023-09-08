import React from "react";
import { ExampleAdvanced } from "./ExampleAdvanced";
import { ExampleFunction } from "./ExampleFunction";
import { ExampleMultipage } from "./ExampleMultipage";
import { ExamplePDF } from "./ExamplePDF";
import { ExamplePDFPreview } from "./ExamplePDFPreview";
import { ExampleUsePDF } from "./ExampleUsePDF";

interface Example {
  title: string;
  component: React.FC;
  content?: string;
}

export const examples: Example[] = [
  {
    title: "Using usePDF hook",
    component: ExampleUsePDF,
    content: `import React from "react";
import { Margin, usePDF } from "react-to-pdf";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";

export const ExampleUsePDF = () => {
  const { toPDF, targetRef } = usePDF({
    filename: "usepdf-example.pdf",
    page: { margin: Margin.MEDIUM },
  });
  return (
    <Container>
      <Button onClick={toPDF}>Download PDF</Button>
      <div ref={targetRef}>
        <Card imageId={12} title="usePDF hook example" />
      </div>
    </Container>
  );
};`,
  },
  {
    title: "Using default function",
    component: ExampleFunction,
    content: `import React from "react";
import generatePDF, { Margin } from "react-to-pdf";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";

export const ExampleFunction = () => {
  const downloadPDF = () => {
    // you can also pass React refs, e.g. \`generatePDF(ref, options)\`
    generatePDF(() => document.getElementById("container"), {
      method: "save",
      filename: "function-example.pdf",
      page: { margin: Margin.MEDIUM },
    });
  };
  return (
    <Container>
      <Button onClick={downloadPDF}>Download PDF</Button>
      <div id="container">
        <Card imageId={18} title="Using default function" />
      </div>
    </Container>
  );
};`,
  },
  {
    title: "Multipage support",
    component: ExampleMultipage,
    content: `import React from "react";
import { Margin, usePDF } from "react-to-pdf";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";

export const ExampleMultipage = () => {
  const { toPDF, targetRef } = usePDF({
    method: "save",
    filename: "multipage-example.pdf",
    page: { margin: Margin.MEDIUM },
  });
  return (
    <Container>
      <Button onClick={toPDF}>Download PDF</Button>
      <div ref={targetRef}>
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <Card
              imageId={30 + index}
              key={index}
              title={\`Multipage support, card #\${index + 1}\`}
            />
          ))}
      </div>
    </Container>
  );
};`,
  },
  {
    title: "Advanced options",
    component: ExampleAdvanced,
    content: `import React from "react";
import generatePDF, { Resolution, Margin, Options } from "react-to-pdf";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";

const options: Options = {
  // default is \`save\`
  method: "open",
  // default is Resolution.MEDIUM = 3, which should be enough, higher values
  // increases the image quality but also the size of the PDF, so be careful
  // using values higher than 10 when having multiple pages generated, it
  // might cause the page to crash or hang.
  resolution: Resolution.HIGH,
  page: {
    // margin is in MM, default is Margin.NONE = 0
    margin: Margin.SMALL,
    // default is 'A4'
    format: "letter",
    // default is 'portrait'
    orientation: "landscape",
  },
  canvas: {
    // default is 'image/jpeg' for better size performance
    mimeType: "image/png",
    qualityRatio: 1,
  },
  // customize any value passed to the jsPDF instance and html2canvas
  // function
  overrides: {
    // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
    pdf: {
      compress: true,
    },
    // see https://html2canvas.hertzen.com/configuration for more options
    canvas: {
      useCORS: true,
    },
  },
};
export const ExampleAdvanced = () => {
  const openPDF = () => {
    generatePDF(() => document.getElementById("wrapper"), options);
  };
  return (
    <Container>
      <Button onClick={openPDF}>Open PDF</Button>
      <div id="wrapper">
        <Card imageId={17} title="Using advanced options" />
      </div>
    </Container>
  );
};`,
  },
  {
    title: "Using PDF component",
    component: ExamplePDF,
    content: `import React, { useRef } from "react";
import { Margin, PDFHandle, PDF } from "react-to-pdf";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";

export const ExamplePDF = () => {
  const pdfRef = useRef<PDFHandle>()
  return (
    <Container>
      <Button onClick={() => pdfRef.current.save({filename: 'pdf-example'})}>Download PDF</Button>
      <PDF
        ref={pdfRef}
        page={{ margin: Margin.MEDIUM }}
      >
        <Card imageId={50} title="PDF example"/>
      </PDF>
    </Container>
  );
};`,
  },
  {
    title: "Using PDF component with preview",
    component: ExamplePDFPreview,
    content: `import React, { useRef, useState } from "react";
import { Margin, PDFHandle, PDF } from "react-to-pdf";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";

export const ExamplePDFPreview = () => {
  const pdfRef = useRef<PDFHandle>()
  return (
    <Container>
      <Button onClick={() => pdfRef.current.save({filename: 'pdf-example'})}>Download PDF</Button>
      <PDF
        preview
        ref={pdfRef}
        page={{ margin: Margin.MEDIUM }}
        width="100%"
        height="400"
        loading={<div>Loading...</div>}
      >
        <Card imageId={45} title="PDF preview example"/>
      </PDF>
    </Container>
  );
};`,
  },
];

