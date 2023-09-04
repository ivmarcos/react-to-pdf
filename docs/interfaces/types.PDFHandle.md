[react-to-pdf](../README.md) / [Modules](../modules.md) / [types](../modules/types.md) / PDFHandle

# Interface: PDFHandle

[types](../modules/types.md).PDFHandle

## Table of contents

### Properties

- [getPDF](types.PDFHandle.md#getpdf)
- [open](types.PDFHandle.md#open)
- [save](types.PDFHandle.md#save)
- [update](types.PDFHandle.md#update)

## Properties

### getPDF

• **getPDF**: () => `jsPDF`

#### Type declaration

▸ (): `jsPDF`

Return the generated PDF instance.

##### Returns

`jsPDF`

#### Defined in

[src/types.ts:118](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L118)

___

### open

• **open**: () => `void`

#### Type declaration

▸ (): `void`

Open the PDF file in a new tab.

##### Returns

`void`

#### Defined in

[src/types.ts:116](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L116)

___

### save

• **save**: (`saveOptions?`: [`PDFSaveOptions`](../modules/types.md#pdfsaveoptions)) => `Promise`<`void`\>

#### Type declaration

▸ (`saveOptions?`): `Promise`<`void`\>

Save the PDF document (download the file).

##### Parameters

| Name | Type |
| :------ | :------ |
| `saveOptions?` | [`PDFSaveOptions`](../modules/types.md#pdfsaveoptions) |

##### Returns

`Promise`<`void`\>

#### Defined in

[src/types.ts:114](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L114)

___

### update

• **update**: () => `void`

#### Type declaration

▸ (): `void`

Update the PDF document.

##### Returns

`void`

#### Defined in

[src/types.ts:112](https://github.com/ivmarcos/react-to-pdf/blob/79d4272/src/types.ts#L112)
