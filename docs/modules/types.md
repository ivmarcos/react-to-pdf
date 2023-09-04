[react-to-pdf](../README.md) / [Modules](../modules.md) / types

# Module: types

## Table of contents

### Interfaces

- [ConversionOptions](../interfaces/types.ConversionOptions.md)
- [Options](../interfaces/types.Options.md)
- [PDFHandle](../interfaces/types.PDFHandle.md)
- [PDFProps](../interfaces/types.PDFProps.md)
- [UsePDFResult](../interfaces/types.UsePDFResult.md)

### Type Aliases

- [DetailedMargin](types.md#detailedmargin)
- [PDFSaveOptions](types.md#pdfsaveoptions)
- [TargetElementFinder](types.md#targetelementfinder)

## Type Aliases

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

[src/types.ts:6](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L6)

___

### PDFSaveOptions

Ƭ **PDFSaveOptions**: `Pick`<[`Options`](../interfaces/types.Options.md), ``"filename"``\>

#### Defined in

[src/types.ts:121](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L121)

___

### TargetElementFinder

Ƭ **TargetElementFinder**: `MutableRefObject`<`any`\> \| () => `HTMLElement` \| ``null``

#### Defined in

[src/types.ts:94](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L94)
