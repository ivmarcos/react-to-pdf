import { MM_TO_PX } from "./constants";


export const mmToPX = (mm: number) => mm * MM_TO_PX;
export const pxToMM = (px: number) => px / MM_TO_PX;
