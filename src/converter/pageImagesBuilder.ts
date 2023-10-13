import { Image } from "./image";
import { Page } from "./page";
import { log } from "../tests/testUtils";
import { TargetImage } from "../types";
import * as utils from '../utils';

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
        log('debug no need to crop! image height is lower than the page', )
        return image;
      }
      const cropHeight = this.calculateCropHeight({ page, image, imageY });
      log('debug just before crop', {cropHeight, imageY, page: page.getNumber(), imageFullHeight: imageHeight, availableHeight, contentHeight: page.getContentHeight()})
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
        log('debug target image', imageIndex);
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
          log('debug before possible crop', {imageIndex, imageY, pages: page.getNumber(), imageHeight})
          const pageImage = this.createPageImage({ page, image, imageY });
          imageY = imageY + pageImage.getHeight();
          log('debug after possible crop', {imageIndex, imageY, pages: page.getNumber(), imageHeight, imageCroppedHeight: pageImage.getHeight()})
          page.addImage(pageImage);
          i++;
          if (i > 100){
            throw new Error('stop loop')
          }
        }
      });
      return this.pages;
    }
  }