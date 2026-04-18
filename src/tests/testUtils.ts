const parseArgs = (args?: any) => {
  if ([null, undefined].includes(args)) {
    return args;
  }
  try {
    return JSON.stringify(args, null, 2);
  } catch (_err) {
    return args;
  }
};

export const log = (text: string, args?: any) => {
  console.log(`[DEBUG] ${text}`, parseArgs(args));
};

export const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", String(width));
  canvas.setAttribute("height", String(height));
  return canvas;
};
