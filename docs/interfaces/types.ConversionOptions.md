[react-to-pdf](../README.md) / [Modules](../modules.md) / [types](../modules/types.md) / ConversionOptions

# Interface: ConversionOptions

[types](../modules/types.md).ConversionOptions

## Table of contents

### Properties

- [canvas](types.ConversionOptions.md#canvas)
- [filename](types.ConversionOptions.md#filename)
- [method](types.ConversionOptions.md#method)
- [overrides](types.ConversionOptions.md#overrides)
- [page](types.ConversionOptions.md#page)
- [resolution](types.ConversionOptions.md#resolution)

## Properties

### canvas

• **canvas**: `CanvasConversionOptions`

Canvas options

#### Defined in

[src/types.ts:60](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L60)

___

### filename

• `Optional` **filename**: `string`

File name of the PDF file if the method select is `save`, which is the
default. Not used for the `build` and `open` methods. *

#### Defined in

[src/types.ts:42](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L42)

___

### method

• **method**: ``"open"`` \| ``"save"`` \| ``"build"``

Method that will follow to do with the PDF file. The `build` method just
returns the PDF instance in the invoked function `generatePDF` or `toPDF`.
By default is `open`.

#### Defined in

[src/types.ts:48](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L48)

___

### overrides

• **overrides**: `Object`

Override values passed for the jsPDF document and html2canvas

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `canvas?` | `Partial`<`Options`\> | Override the values passed for the html2canvas function. See its docs for more details in https://html2canvas.hertzen.com/documentation |
| `pdf?` | `Partial`<`jsPDFOptions`\> | Override the values passed for the jsPDF instance. See its docs for more details in https://artskydj.github.io/jsPDF/docs/jsPDF.html. |

#### Defined in

[src/types.ts:62](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L62)

___

### page

• **page**: `PageConversionOptions`

Page options

#### Defined in

[src/types.ts:58](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L58)

___

### resolution

• **resolution**: `number`

Resolution in a scale where 1 gives a low resolution and possible blurred
image, 3 a medium and 10 an extreme quality. The size of the file increases
as the resolution is higher. Not recommended to use extreme resolution, e.g
'>= 10' for multiple pages otherwise this can make the browser cache hang
or crash, due to the size of the image generated for the PDF.

#### Defined in

[src/types.ts:56](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L56)
