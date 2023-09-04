[react-to-pdf](../README.md) / [Modules](../modules.md) / [types](../modules/types.md) / Options

# Interface: Options

[types](../modules/types.md).Options

## Hierarchy

- `Omit`<`Partial`<[`ConversionOptions`](types.ConversionOptions.md)\>, ``"page"`` \| ``"canvas"`` \| ``"overrides"``\>

  ↳ **`Options`**

## Table of contents

### Properties

- [canvas](types.Options.md#canvas)
- [filename](types.Options.md#filename)
- [method](types.Options.md#method)
- [overrides](types.Options.md#overrides)
- [page](types.Options.md#page)
- [resolution](types.Options.md#resolution)

## Properties

### canvas

• `Optional` **canvas**: `Partial`<`CanvasConversionOptions`\>

#### Defined in

[src/types.ts:79](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L79)

___

### filename

• `Optional` **filename**: `string`

File name of the PDF file if the method select is `save`, which is the
default. Not used for the `build` and `open` methods. *

#### Inherited from

Omit.filename

#### Defined in

[src/types.ts:42](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L42)

___

### method

• `Optional` **method**: ``"open"`` \| ``"save"`` \| ``"build"``

Method that will follow to do with the PDF file. The `build` method just
returns the PDF instance in the invoked function `generatePDF` or `toPDF`.
By default is `open`.

#### Inherited from

Omit.method

#### Defined in

[src/types.ts:48](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L48)

___

### overrides

• `Optional` **overrides**: `Partial`<{ `canvas?`: `Partial`<`Options`\> ; `pdf?`: `Partial`<`jsPDFOptions`\>  }\>

#### Defined in

[src/types.ts:80](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L80)

___

### page

• `Optional` **page**: `Partial`<`PageConversionOptions`\>

#### Defined in

[src/types.ts:78](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L78)

___

### resolution

• `Optional` **resolution**: `number`

Resolution in a scale where 1 gives a low resolution and possible blurred
image, 3 a medium and 10 an extreme quality. The size of the file increases
as the resolution is higher. Not recommended to use extreme resolution, e.g
'>= 10' for multiple pages otherwise this can make the browser cache hang
or crash, due to the size of the image generated for the PDF.

#### Inherited from

Omit.resolution

#### Defined in

[src/types.ts:56](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L56)
