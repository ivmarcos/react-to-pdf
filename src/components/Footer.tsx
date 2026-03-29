import React, { useContext } from "react";
import { FooterHeaderProps } from "../types";
import { FooterHeaderPage } from "./FooterHeaderPage";
import { PDFContext } from "./PDF";

export const Footer = ({ render }: FooterHeaderProps): JSX.Element => {
  const { pages, registerFooter } = useContext(PDFContext);
  return (
    <FooterHeaderPage pages={pages} register={registerFooter} render={render} />
  );
};

Footer.displayName = "Footer";
