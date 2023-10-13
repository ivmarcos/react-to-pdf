import { Image } from "../converter/image";

const parseArgs = (args?: any) => {
  if ([null, undefined].includes(args)){
    return args;
  }
  try {
    return JSON.stringify(args, null, 2)
  }catch(err){
    return args;
  }
}

export const log = (text: string, args?: any) => {
    console.log(`[DEBUG] ${text}`, parseArgs(args))
}

export const createCanvas = (width:number, height: number) => {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", String(width));
    canvas.setAttribute("height", String(height));
    return canvas;
  }
  
  export const createImage = (width: number, height: number, scale = 1) => {
    const canvas = createCanvas(width, height);
    const image = new Image(canvas, scale);
    return image;
  }