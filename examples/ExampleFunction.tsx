import React from "react";
import generatePDF, { print, Margin } from "react-to-pdf";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";
import { Alignment } from "../src/constants";

export const ExampleFunction = () => {
  const downloadPDF = () => {
    // you can also pass React refs, e.g. `generatePDF(ref, options)`
    print(() => document.getElementById("container"), {
      // method: "open",
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
};
