import React from "react";

import "./app.css";
import { Code } from "./Code";
import examples from "./examples";

const slugify = (text: string) => text.toLowerCase().replace(/\s/g, "-");

export const App = () => {
  console.log("debug", examples);
  return (
    <div className="app-container">
      <h1>React to PDF - Examples</h1>
      {(examples || []).map((example) => (
        <a id={`example-${slugify(example.title)}`} key={example.title}>
          <h3>{example.title}</h3>
          {example.content && <Code>{example.content}</Code>}
          <example.component />
        </a>
      ))}
    </div>
  );
};
