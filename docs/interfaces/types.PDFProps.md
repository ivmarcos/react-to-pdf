[react-to-pdf](../README.md) / [Modules](../modules.md) / [types](../modules/types.md) / PDFProps

# Interface: PDFProps

[types](../modules/types.md).PDFProps

## Hierarchy

- `Omit`<[`Options`](types.Options.md), ``"filename"`` \| ``"method"``\>

- `Pick`<`React.HTMLProps`<`HTMLEmbedElement`\>, ``"width"`` \| ``"height"`` \| ``"className"``\>

  ↳ **`PDFProps`**

## Table of contents

### Properties

- [canvas](types.PDFProps.md#canvas)
- [children](types.PDFProps.md#children)
- [className](types.PDFProps.md#classname)
- [height](types.PDFProps.md#height)
- [loading](types.PDFProps.md#loading)
- [overrides](types.PDFProps.md#overrides)
- [page](types.PDFProps.md#page)
- [preview](types.PDFProps.md#preview)
- [resolution](types.PDFProps.md#resolution)
- [width](types.PDFProps.md#width)

## Properties

### canvas

• `Optional` **canvas**: `Partial`<`CanvasConversionOptions`\>

#### Inherited from

Omit.canvas

#### Defined in

[src/types.ts:79](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L79)

___

### children

• **children**: `ReactNode`

Content to be generated to the PDF document.

#### Defined in

[src/types.ts:104](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L104)

___

### className

• `Optional` **className**: `string`

#### Inherited from

Pick.className

#### Defined in

node_modules/@types/react/ts5.0/index.d.ts:1838

___

### height

• `Optional` **height**: `string` \| `number`

#### Inherited from

Pick.height

#### Defined in

node_modules/@types/react/ts5.0/index.d.ts:1941

___

### loading

• `Optional` **loading**: `ReactNode`

Loading component to display when the PDF document is being generated. For
example, `loading={<div>Loading...</div>}`.

#### Defined in

[src/types.ts:107](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L107)

___

### overrides

• `Optional` **overrides**: `Partial`<{ `canvas?`: `Partial`<`Options`\> ; `pdf?`: `Partial`<`jsPDFOptions`\>  }\>

#### Inherited from

Omit.overrides

#### Defined in

[src/types.ts:80](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L80)

___

### page

• `Optional` **page**: `Partial`<`PageConversionOptions`\>

#### Inherited from

Omit.page

#### Defined in

[src/types.ts:78](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L78)

___

### preview

• `Optional` **preview**: `boolean`

Enable to render the embed generated PDF document.

#### Defined in

[src/types.ts:102](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L102)

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

___

### width

• `Optional` **width**: `string` \| `number`

#### Inherited from

Pick.width

#### Defined in

node_modules/@types/react/ts5.0/index.d.ts:2002
