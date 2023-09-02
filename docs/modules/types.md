[react-to-pdf](../README.md) / [Modules](../modules.md) / types

# Module: types

## Table of contents

### Type Aliases

- [ConversionOptions](types.md#conversionoptions)
- [DetailedMargin](types.md#detailedmargin)
- [Options](types.md#options)
- [TargetElementFinder](types.md#targetelementfinder)
- [UsePDFResult](types.md#usepdfresult)

## Type Aliases

### ConversionOptions

Ƭ **ConversionOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `canvas` | `CanvasConversionOptions` | Canvas options |
| `filename?` | `string` | File name of the PDF file if the method select is `save`, which is the default. Not used for the `build` and `open` methods. * |
| `method` | ``"save"`` \| ``"open"`` \| ``"build"`` | Method that will follow to do with the PDF file. The `build` method just returns the PDF instance in the invoked function `generatePDF` or `toPDF`. By default is `open`. |
| `overrides` | { `canvas?`: `Partial`<`Html2CanvasOptions`\> ; `pdf?`: `Partial`<`jsPDFOptions`\>  } | Override values passed for the jsPDF document and html2canvas |
| `overrides.canvas?` | `Partial`<`Html2CanvasOptions`\> | Override the values passed for the html2canvas function. See its docs for more details in https://html2canvas.hertzen.com/documentation |
| `overrides.pdf?` | `Partial`<`jsPDFOptions`\> | Override the values passed for the jsPDF instance. See its docs for more details in https://artskydj.github.io/jsPDF/docs/jsPDF.html. |
| `page` | `PageConversionOptions` | Page options |
| `resolution` | [`Resolution`](../enums/constants.Resolution.md) \| `number` | Resolution in a scale where 1 gives a low resolution and possible blurred image, 3 a medium and 10 an extreme quality. The size of the file increases as the resolution is higher. Not recommended to use extreme resolution, e.g '>= 10' for multiple pages otherwise this can make the browser cache hang or crash, due to the size of the image generated for the PDF. |

#### Defined in

[types.ts:39](https://github.com/ivmarcos/react-to-pdf/blob/36bd08b/src/types.ts#L39)

___

### DetailedMargin

Ƭ **DetailedMargin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bottom` | [`Margin`](../enums/constants.Margin.md) \| `number` |
| `left` | [`Margin`](../enums/constants.Margin.md) \| `number` |
| `right` | [`Margin`](../enums/constants.Margin.md) \| `number` |
| `top` | [`Margin`](../enums/constants.Margin.md) \| `number` |

#### Defined in

[types.ts:6](https://github.com/ivmarcos/react-to-pdf/blob/36bd08b/src/types.ts#L6)

___

### Options

Ƭ **Options**: `Omit`<`Partial`<[`ConversionOptions`](types.md#conversionoptions)\>, ``"page"`` \| ``"canvas"`` \| ``"overrides"``\> & { `canvas?`: `Partial`<`CanvasConversionOptions`\> ; `overrides?`: `Partial`<[`ConversionOptions`](types.md#conversionoptions)[``"overrides"``]\> ; `page?`: `Partial`<`PageConversionOptions`\>  }

#### Defined in

[types.ts:78](https://github.com/ivmarcos/react-to-pdf/blob/36bd08b/src/types.ts#L78)

___

### TargetElementFinder

Ƭ **TargetElementFinder**: `MutableRefObject`<`any`\> \| () => `HTMLElement` \| ``null``

#### Defined in

[types.ts:98](https://github.com/ivmarcos/react-to-pdf/blob/36bd08b/src/types.ts#L98)

___

### UsePDFResult

Ƭ **UsePDFResult**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `targetRef` | `MutableRefObject`<`any`\> | React ref of the target element |
| `toPDF` | (`options?`: [`Options`](types.md#options)) => `void` | Generates the pdf |

#### Defined in

[types.ts:87](https://github.com/ivmarcos/react-to-pdf/blob/36bd08b/src/types.ts#L87)
