import jsPDF from "jspdf";
import { DocumentConverterOptions } from "./types";

const canvasToImage = async (canvas: HTMLCanvasElement): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const newImg = document.createElement("img");
      const url = URL.createObjectURL(blob);
    
      newImg.onload = () => {
        // no longer need to read the blob so it's revoked
        URL.revokeObjectURL(url);
      };
    
      newImg.src = url;
      resolve(newImg)
    }, "image/jpeg", 0.7);
  
  })
  
}

const canvasToBlob = async (canvas: HTMLCanvasElement): Promise<Uint8Array> => {
  return new Promise((resolve) => {
    canvas.toBlob(async(blob) => {
      const arr = new Uint8Array(await blob.arrayBuffer());
      resolve(arr)
    }, "image/jpeg", 0.7);
  
  })
  
}
export class Document {
  options: DocumentConverterOptions;
  instance: InstanceType<typeof jsPDF>;
  constructor(options: DocumentConverterOptions) {
    this.options = options;
    this.instance = new jsPDF({
      format: this.options.page.format,
      orientation: this.options.page.orientation,
      ...this.options.overrides?.pdf,
      unit: "mm",
    });
  }

  addPage() {
    this.instance.addPage(
      this.options.page.format,
      this.options.page.orientation
    );
  }

  getNumberOfPages() {
    return this.instance.getNumberOfPages();
  }

  async addCanvasToPage({
    canvas,
    page = 1,
    width,
    height,
    x,
    y,
  }: {
    canvas: HTMLCanvasElement;
    page: number;
    width: number;
    height: number;
    x: number;
    y: number;
  }) {
    const imageData = canvas.toDataURL(
      this.options.canvas.mimeType,
      this.options.canvas.qualityRatio
    );
    // const imageElement = await canvasToImage(canvas);
    // const blob = await canvasToBlob(canvas)
    // return new Promise((resolve) => {
    //   canvas.toBlob(async blob => {
    //     const arr = new Uint8Array(await blob.arrayBuffer());
    //     this.instance.setPage(page);
    //     this.instance.addImage({
    //       imageData: arr,
    //       width,
    //       height,
    //       x,
    //       y,
    //     });
    //     resolve(true);
    //   });
    // })
    this.instance.setPage(page);
    this.instance.addImage({
      imageData: imageData,
      width,
      height,
      x,
      y,
    });
  }
  async save(filename?: string) {
    return this.instance.save(
      filename ?? this.options.filename ?? `${new Date().getTime()}.pdf`,
      { returnPromise: true }
    );
  }
  open() {
    window.open(this.instance.output("bloburl"), "_blank");
  }
  print() {
    this.instance.autoPrint();
    this.instance.output("dataurlnewwindow");
  }
  getBlob() {
    return new Blob([this.instance.output("blob")], {type: 'application/pdf'});
  }
  getBlobURL() {
    return this.instance.output("bloburl");
  }
  getPageMaxWidth() {
    return this.getPageWidth() - (this.getMarginLeft() + this.getMarginRight());
  }
  getPageMaxHeight() {
    return (
      this.getPageHeight() - (this.getMarginTop() + this.getMarginBottom())
    );
  }
  getPageHeight() {
    return this.instance.internal.pageSize.height;
  }
  getPageWidth() {
    return this.instance.internal.pageSize.width;
  }
  getMarginTop() {
    const margin =
      typeof this.options.page.margin === "object"
        ? this.options.page.margin.top
        : this.options.page.margin;
    return Number(margin);
  }
  getMarginLeft() {
    const margin =
      typeof this.options.page.margin === "object"
        ? this.options.page.margin.left
        : this.options.page.margin;
    return Number(margin);
  }
  getMarginRight() {
    const margin =
      typeof this.options.page.margin === "object"
        ? this.options.page.margin.right
        : this.options.page.margin;
    return Number(margin);
  }
  getMarginBottom() {
    const margin =
      typeof this.options.page.margin === "object"
        ? this.options.page.margin.bottom
        : this.options.page.margin;
    return Number(margin);
  }
  getInstance() {
    return this.instance;
  }
}
