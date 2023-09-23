import React from "react";
import { Margin, usePDF } from "react-to-pdf";
import { Card } from "./Card";
import { Button } from "./Button";
import { Container } from "./Container";

export const ExampleMultipage = () => {
  const { toPDF, targetRef } = usePDF({
    method: "save",
    filename: "multipage-example.pdf",
    page: { margin: Margin.MEDIUM },
    resolution: 3,
    canvas: {
      mimeType: "image/jpeg",
      qualityRatio: 0.9,
    },
    overrides: {
      canvas: {
        logging: true,
      },
    },
  });
  return (
    <Container>
      <Button onClick={toPDF}>Download PDF</Button>
      <div ref={targetRef}>
        {Array(50)
          .fill(0)
          .map((_, index) => (
            <Card
              imageId={30 + index}
              key={index}
              title={`Multipage support, card #${index + 1}`}
            />
          ))}
      </div>
    </Container>
  );
};
