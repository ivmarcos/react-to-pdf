import { MM_TO_PX } from "./constants";
import { Image } from "./image";

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
  ctx.drawImage(
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
  console.log("DEBUG FILL RATIO", { targetSize, size });
  if (size < targetSize) {
    return targetSize / size;
  }
  return size / targetSize;
};

export const getImageDimensionsMM = (image: InstanceType<typeof Image>) => {
  return {
    width: pxToMM(image.getOriginalWidth()),
    height: pxToMM(image.getOriginalHeight()),
  };
};
