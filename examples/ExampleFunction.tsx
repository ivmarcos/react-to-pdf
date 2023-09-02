import React from "react";
import generatePDF, { Margin } from "../src";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";

export const ExampleFunction = () => {
  const downloadPDF = () => {
    // you can also pass React refs, e.g. `generatePDF(ref, options)`
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
};
