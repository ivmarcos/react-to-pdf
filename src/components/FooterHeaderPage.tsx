import React from 'react'
import { PDFContextValues, containerStyle } from './PDF';
import { FooterHeaderProps } from '../types';
import { PreviewPortal } from './PreviewPortal';

interface FooterHeaderPageProps extends Pick<FooterHeaderProps, "render"> {
    register: PDFContextValues["registerFooter"] | PDFContextValues["registerHeader"],
    pages: number
}

export const FooterHeaderPage = ({pages, register, render}: FooterHeaderPageProps) => {
const children = Array(pages).fill(null).map((_, index) => {
    return (
      <div style={containerStyle} key={index} ref={element => register({element, index})}>
      {render({page: index + 1, pages})}
    </div>
    )
  });
  return (
    <PreviewPortal>
      {children}
    </PreviewPortal>
  )}

  FooterHeaderPage.displayName = "FooterHeaderPage"