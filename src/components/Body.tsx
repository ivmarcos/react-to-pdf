import React, { useContext, useEffect, useRef } from 'react'
import { PDFContext } from './PDF'
import { TargetOptions } from '../types'

export interface BodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode,
    targetIndex?:number,
    registerTarget?: (element: HTMLDivElement, index, options?: TargetOptions) => void,
    startOnNewPage?: boolean
}

const Body = ({children, startOnNewPage, registerTarget, targetIndex,  ...props}: BodyProps) => {
  return (
    <div {...props} ref={element => registerTarget?.(element, targetIndex, {startOnNewPage})}>{children}</div>
  )
}

Body.displayName = 'Body'

export default Body