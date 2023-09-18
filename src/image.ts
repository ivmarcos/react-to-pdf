export class Image {
  scale: number;
  canvas: HTMLCanvasElement;
  constructor(canvas: HTMLCanvasElement, scale: number) {
    this.canvas = canvas;
    this.scale = scale;
  }
  getCanvas() {
    return this.canvas;
  }
  getWidth() {
    return this.canvas.width;
  }
  getHeight() {
    return this.canvas.height;
  }
  getOriginalWidth() {
    return this.getWidth() / this.scale;
  }
  getOriginalHeight() {
    return this.getHeight() / this.scale;
  }
}
