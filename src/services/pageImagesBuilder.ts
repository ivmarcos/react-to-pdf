import { Image } from "../models/image";
import { Page } from "../models/page";
import { TargetImage } from "../types";
import * as utils from "../utils";

export class PageImagesBuilder {
  private pageHeight: number;
  private targetImages: TargetImage[];
  private pages: Page[];
  constructor(targetImages: TargetImage[], pageHeight: number) {
    this.targetImages = targetImages;
    this.pageHeight = pageHeight;
  }
  private createPage(): InstanceType<typeof Page> {
    const currentNumber = this.pages.length;
    const newPage = new Page({
      number: currentNumber + 1,
      height: this.pageHeight,
    });
    this.pages.push(newPage);
    return newPage;
  }
  private calculateCropHeight({
    page,
    image,
    imageY,
  }: {
    page: Page;
    image: Image;
    imageY: number;
  }) {
    const imageHeight = image.getHeight();
    const availableHeight = page.getAvailableHeight();
    if (imageHeight - imageY <= availableHeight) {
      return imageHeight - imageY;
    }
    //   if (imageHeight <= availableHeight) {
    //     return imageHeight;
    //   }
    return availableHeight;
  }
  private createPageImage({
    page,
    image,
    imageY,
  }: {
    page: Page;
    image: Image;
    imageY: number;
  }): InstanceType<typeof Image> {
    const imageHeight = image.getHeight();
    const imageWidth = image.getWidth();
    const availableHeight = page.getAvailableHeight();
    if (imageHeight <= availableHeight && imageY === 0) {
      return image;
    }
    const cropHeight = this.calculateCropHeight({ page, image, imageY });
    const pageCanvas = utils.cropY({
      width: imageWidth,
      height: cropHeight,
      offsetY: imageY,
      canvas: image.getCanvas(),
    });
    return new Image(pageCanvas, image.getScale());
  }

  createPages(): Page[] {
    let page: Page = null;
    this.pages = [];
    this.targetImages.forEach((targetImage, imageIndex) => {
      const requiresNewPage = targetImage.options?.startOnNewPage;
      if (requiresNewPage || !page) {
        page = this.createPage();
      }
      const image = targetImage.image;
      const imageHeight = image.getHeight();
      let imageY = 0;
      let i = 0;
      while (imageY < imageHeight) {
        if (page.isFull()) {
          page = this.createPage();
        }
        const pageImage = this.createPageImage({ page, image, imageY });
        imageY = imageY + pageImage.getHeight();
        page.addImage(pageImage);
        i++;
        if (i > 100) {
          throw new Error("stop loop");
        }
      }
    });
    return this.pages;
  }
}
