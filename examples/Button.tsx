import React from "react";
import "./button.css";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export const Button = (props: ButtonProps) => {
  return <button className="button" {...props} />;
};
