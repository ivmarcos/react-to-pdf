import React from "react";
import generatePDF, { Resolution, Margin, Options } from "../src";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";

const options: Options = {
  // default is `save`
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
};
