[react-to-pdf](../README.md) / [Modules](../modules.md) / index

# Module: index

## Table of contents

### References

- [ConversionOptions](index.md#conversionoptions)
- [DetailedMargin](index.md#detailedmargin)
- [Margin](index.md#margin)
- [Options](index.md#options)
- [PDFHandle](index.md#pdfhandle)
- [PDFProps](index.md#pdfprops)
- [PDFSaveOptions](index.md#pdfsaveoptions)
- [Resolution](index.md#resolution)
- [TargetElementFinder](index.md#targetelementfinder)
- [UsePDFResult](index.md#usepdfresult)

### Functions

- [PDF](index.md#pdf)
- [default](index.md#default)
- [usePDF](index.md#usepdf)

## References

### ConversionOptions

Re-exports [ConversionOptions](../interfaces/types.ConversionOptions.md)

___

### DetailedMargin

Re-exports [DetailedMargin](types.md#detailedmargin)

___

### Margin

Re-exports [Margin](../enums/constants.Margin.md)

___

### Options

Re-exports [Options](../interfaces/types.Options.md)

___

### PDFHandle

Re-exports [PDFHandle](../interfaces/types.PDFHandle.md)

___

### PDFProps

Re-exports [PDFProps](../interfaces/types.PDFProps.md)

___

### PDFSaveOptions

Re-exports [PDFSaveOptions](types.md#pdfsaveoptions)

___

### Resolution

Re-exports [Resolution](../enums/constants.Resolution.md)

___

### TargetElementFinder

Re-exports [TargetElementFinder](types.md#targetelementfinder)

___

### UsePDFResult

Re-exports [UsePDFResult](../interfaces/types.UsePDFResult.md)

## Functions

### PDF

▸ **PDF**(`props`): `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

**NOTE**: Exotic components are not callable.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`PDFProps`](../interfaces/types.PDFProps.md) & `RefAttributes`<[`PDFHandle`](../interfaces/types.PDFHandle.md)\> |

#### Returns

`ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

#### Defined in

node_modules/@types/react/ts5.0/index.d.ts:329

___

### default

▸ **default**(`targetRefOrFunction`, `customOptions?`): `Promise`<`jsPDF`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetRefOrFunction` | [`TargetElementFinder`](types.md#targetelementfinder) |
| `customOptions?` | [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<`jsPDF`\>

#### Defined in

[src/index.ts:30](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/index.ts#L30)

___

### usePDF

▸ **usePDF**(`usePDFoptions?`): [`UsePDFResult`](../interfaces/types.UsePDFResult.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `usePDFoptions?` | [`Options`](../interfaces/types.Options.md) |

#### Returns

[`UsePDFResult`](../interfaces/types.UsePDFResult.md)

#### Defined in

[src/index.ts:19](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/index.ts#L19)
