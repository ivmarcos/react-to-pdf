import React from "react";

import "./app.css";
import { examples } from "./examples";
import { slugify } from "./utils";

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
