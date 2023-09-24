import { Image } from "./image";

export const log = (text: string, args?: any) => {
    console.log(`[DEBUG] ${text}`, JSON.stringify(args, null, 2))
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