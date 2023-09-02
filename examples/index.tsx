import React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";

const container = document.getElementById("app");
if (container) {
  ReactDOM.render(<App />, container);
}
