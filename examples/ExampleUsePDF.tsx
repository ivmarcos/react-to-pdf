import React from "react";
import { Margin, Position, Size, usePDF } from "react-to-pdf";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";

export const ExampleUsePDF = () => {
  const { toPDF, targetRef } = usePDF({
    filename: "usepdf-example.pdf",
    page: { margin: Margin.MEDIUM },
    align: Position.CENTER_X,
    size: Size.FILL_PAGE,
  });
  return (
    <Container>
      <Button onClick={toPDF}>Download PDF</Button>
      <div ref={targetRef}>
        <Card imageId={12} title="usePDF hook example" />
      </div>
    </Container>
  );
};
