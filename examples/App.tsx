import React from "react";

import "./app.css";
import { Code } from "./Code";
import { examples } from "./examples";
import { slugify } from "./utils";

export const App = () => {
  console.log("debug", examples);
  return (
    <div className="app-container">
      <h1>React to PDF - Examples</h1>
      {(examples || []).slice(5,6).map((example) => (
        <a id={`example-${slugify(example.title)}`} key={example.title}>
          <h3>{example.title}</h3>
          {example.content && <Code>{example.content}</Code>}
          <example.component />
        </a>
      ))}
    </div>
  );
};
