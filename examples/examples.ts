import { ExampleUsePDF } from "./ExampleUsePDF";
import { ExampleFunction } from "./ExampleFunction";
import { ExampleMultipage } from "./ExampleMultipage";
import { ExampleAdvanced } from "./ExampleAdvanced";

export interface Example {
  title: string;
  component: React.FC;
}

export const examples: Example[] = [
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
