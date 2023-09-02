[react-to-pdf](../README.md) / [Modules](../modules.md) / index

# Module: index

## Table of contents

### References

- [Margin](index.md#margin)
- [Options](index.md#options)
- [Resolution](index.md#resolution)

### Functions

- [default](index.md#default)
- [usePDF](index.md#usepdf)

## References

### Margin

Re-exports [Margin](../enums/constants.Margin.md)

___

### Options

Re-exports [Options](types.md#options)

___

### Resolution

Re-exports [Resolution](../enums/constants.Resolution.md)

## Functions

### default

▸ **default**(`targetRefOrFunction`, `customOptions?`): `Promise`<`jsPDF`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetRefOrFunction` | [`TargetElementFinder`](types.md#targetelementfinder) |
| `customOptions?` | [`Options`](types.md#options) |

#### Returns

`Promise`<`jsPDF`\>

#### Defined in

[index.ts:31](https://github.com/ivmarcos/react-to-pdf/blob/36bd08b/src/index.ts#L31)

___

### usePDF

▸ **usePDF**(`usePDFoptions?`): [`UsePDFResult`](types.md#usepdfresult)

#### Parameters

| Name | Type |
| :------ | :------ |
| `usePDFoptions?` | [`Options`](types.md#options) |

#### Returns

[`UsePDFResult`](types.md#usepdfresult)

#### Defined in

[index.ts:20](https://github.com/ivmarcos/react-to-pdf/blob/36bd08b/src/index.ts#L20)
