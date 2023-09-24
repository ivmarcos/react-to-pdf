import { Image } from "./image";

export class Page {
    private number: number;
    private images: Image[] = [];
    private height: number;
  
    constructor({ number, height }: { number: number; height: number }) {
      this.number = number;
      this.height = height;
    }
    addImage(image) {
      this.images.push(image);
    }
    getContentHeight() {
      return this.images
        .map((image) => image.getHeight())
        .reduce((h1, h2) => h1 + h2, 0);
    }
    getNumber() {
      return this.number;
    }
    getAvailableHeight() {
      return this.height - this.getContentHeight();
    }
    isFull() {
      return this.getAvailableHeight() === 0;
    }
    getImages() {
      return this.images;
    }
    getImageY(image: Image): number {
      if (!this.images.includes(image)) {
        throw new Error("Image does not exist in page");
      }
      const index = this.images.indexOf(image);
      return this.images
        .slice(0, index)
        .map((image) => image.getOriginalHeight())
        .reduce((h1, h2) => h1 + h2, 0);
    }
  }