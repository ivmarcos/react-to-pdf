import React, { useContext } from 'react';
import { FooterHeaderProps } from '../types';
import { FooterHeaderPage } from './FooterHeaderPage';
import { PDFContext } from './PDF';

export const Header = ({render}: FooterHeaderProps) => {
  const {pages, registerHeader} = useContext(PDFContext);
  return <FooterHeaderPage pages={pages} register={registerHeader} render={render}/>
}

Header.displayName = 'Header'