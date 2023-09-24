import React, { useContext, useEffect, useRef } from 'react'
import { PDFContext } from './PDF'
import { TargetOptions } from './types'

export interface TargetProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode,
    targetIndex?:number,
    registerTarget?: (element: HTMLDivElement, index, options?: TargetOptions) => void,
    startOnNewPage?: boolean
}

const Target = ({children, startOnNewPage, registerTarget, targetIndex,  ...props}: TargetProps) => {
  return (
    <div {...props} ref={element => registerTarget?.(element, targetIndex, {startOnNewPage})}>{children}</div>
  )
}

Target.displayName = 'Target'

export default Target