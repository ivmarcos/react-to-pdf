[react-to-pdf](../README.md) / [Modules](../modules.md) / index

# Module: index

## Table of contents

### References

- [Margin](index.md#margin)
- [Resolution](index.md#resolution)

### Functions

- [default](index.md#default)
- [usePDF](index.md#usepdf)

## References

### Margin

Re-exports [Margin](../enums/constants.Margin.md)

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
| `customOptions?` | [`ReactToPDFOptions`](types.md#reacttopdfoptions) |

#### Returns

`Promise`<`jsPDF`\>

#### Defined in

index.ts:31

___

### usePDF

▸ **usePDF**(`usePDFoptions?`): [`UsePDFResult`](types.md#usepdfresult)

#### Parameters

| Name | Type |
| :------ | :------ |
| `usePDFoptions?` | [`ReactToPDFOptions`](types.md#reacttopdfoptions) |

#### Returns

[`UsePDFResult`](types.md#usepdfresult)

#### Defined in

index.ts:20
