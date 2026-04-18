import jsPDF from "jspdf";

/**
 * Thin facade over a jsPDF instance that exposes the same save/open/print
 * surface the library has historically returned from `create()` and its
 * siblings. Prefer using the `jsPDF` instance directly via `getInstance()`;
 * the facade stays for backwards compatibility.
 */
export class Document {
  constructor(
    public readonly instance: InstanceType<typeof jsPDF>,
    private readonly filename?: string
  ) {}

  async save(filename?: string): Promise<void> {
    const resolved =
      filename ?? this.filename ?? `document-${Date.now()}.pdf`;
    const withExt = ensurePdfExtension(resolved);
    return this.instance.save(withExt, { returnPromise: true });
  }

  open(): void {
    window.open(this.instance.output("bloburl"), "_blank");
  }

  print(): void {
    this.instance.autoPrint();
    this.instance.output("dataurlnewwindow");
  }

  getInstance(): InstanceType<typeof jsPDF> {
    return this.instance;
  }

  getBlob(): Blob {
    return new Blob([this.instance.output("blob")], {
      type: "application/pdf",
    });
  }

  getBlobURL(): string {
    return this.instance.output("bloburl") as unknown as string;
  }

  getNumberOfPages(): number {
    return this.instance.getNumberOfPages();
  }
}

function ensurePdfExtension(name: string): string {
  if (!name) return `document-${Date.now()}.pdf`;
  return /\.pdf$/i.test(name) ? name : `${name}.pdf`;
}
