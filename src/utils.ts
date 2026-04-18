import { MM_TO_PX } from "./constants";

export const mmToPX = (mm: number) => mm * MM_TO_PX;
export const pxToMM = (px: number) => px / MM_TO_PX;

export const cropY = ({
  width,
  height,
  offsetY,
  canvas,
}: {
  width: number;
  height: number;
  offsetY: number;
  canvas: HTMLCanvasElement;
}): HTMLCanvasElement => {
  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.setAttribute("width", String(width));
  croppedCanvas.setAttribute("height", String(height));
  const ctx = croppedCanvas.getContext("2d");
  ctx?.drawImage(
    canvas,
    0,
    offsetY,
    canvas.width,
    height,
    0,
    0,
    canvas.width,
    height
  );
  return croppedCanvas;
};

export const calculateHeightOffset = ({
  maxHeight,
  height,
  offsetY,
}: {
  maxHeight: number;
  height: number;
  offsetY: number;
}): number => {
  if (height < maxHeight) {
    return height;
  }
  if (height - offsetY < maxHeight) {
    return height - offsetY;
  }
  return maxHeight;
};

export const calculateFitRatio = ({
  maxSize,
  size,
}: {
  maxSize: number;
  size: number;
}) => {
  if (size > maxSize) {
    return maxSize / size;
  }
  return 1;
};

export const calculateFillRatio = ({
  targetSize,
  size,
}: {
  targetSize: number;
  size: number;
}) => {
  return targetSize / size;
};

/**
 * Convert pixel dimensions of a canvas at a given display scale to mm.
 * `displayScale` is the html2canvas scale that was used to capture the
 * canvas; dividing by it yields the original on-screen size.
 */
export const canvasDimensionsMM = (
  canvas: HTMLCanvasElement,
  displayScale: number
) => ({
  width: pxToMM(canvas.width / displayScale),
  height: pxToMM(canvas.height / displayScale),
});
