import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { PREVIEW_ROOT_CLASS_NAME } from "../constants";

interface PreviewPortalProps {
  children: React.ReactNode;
}

export const PreviewPortal = ({ children }: PreviewPortalProps) => {
  const [container] = useState<HTMLDivElement>(() => {
    return document.createElement("div");
  });

  useEffect(() => {
    container.classList.add(PREVIEW_ROOT_CLASS_NAME);
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  return ReactDOM.createPortal(children, container);
};
