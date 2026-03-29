import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import "./code.css";

interface CodeProps {
  children: string;
}

export const Code = ({ children }: CodeProps) => {
  return (
    <div className="code-container">
      <SyntaxHighlighter language="typescript">{children}</SyntaxHighlighter>
    </div>
  );
};
