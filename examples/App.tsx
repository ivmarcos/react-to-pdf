import React from "react";
import { ExampleUsePDF } from "./ExampleUsePDF";
import { ExampleFunction } from "./ExampleFunction";
import { ExampleMultipage } from "./ExampleMultipage";
import { ExampleAdvanced } from "./ExampleAdvanced";
import "./app.css";

interface Example {
  title: string;
  component: React.FC;
}

const slugify = (text: string) => text.toLowerCase().replace(/\s/g, "-");

const examples: Example[] = [
  {
    title: "Using usePDF hook",
    component: ExampleUsePDF,
  },
  {
    title: "Using default function",
    component: ExampleFunction,
  },
  {
    title: "Multipage support",
    component: ExampleMultipage,
  },
  {
    title: "Advanced options",
    component: ExampleAdvanced,
  },
];

export const App = () => {
  return (
    <div className="app-container">
      <h1>React to PDF - Examples</h1>
      {examples.map((example) => (
        <a id={`example-${slugify(example.title)}`} key={example.title}>
          <h3>{example.title}</h3>
          <example.component />
        </a>
      ))}
    </div>
  );
};
