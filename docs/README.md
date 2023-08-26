react-to-pdf / [Modules](modules.md)

# React to PDF

Easily create pdf documents from React components.

## Install

```
$ npm install react-to-pdf
```

## Important Notes

- No SSR
- Single page
- Not vectorized - the pdf is created from a screenshot of the component and therefore is not vectorized. If you are looking for something more advanced for generating pdf using React components, please check out other popular alternatives packages listed below.

## Alternatives and Similars Packages

* [@react-pdf/renderer](https://www.npmjs.com/package/@react-pdf/renderer) - React renderer for creating PDF files on the browser and server
* [react-pdf](https://www.npmjs.com/package/react-pdf) - Display PDFs in your React app as easily as if they were images.

## Examples

https://codesandbox.io/s/l2l4pz0jyl

## Usage

**Using hook**

```jsx
   import { usePDF } from 'react-to-pdf'

const Component = () => {
   const { toPDF, targetRef } = usePDF();

return (
   <button onClick={toPDF}>Generate PDF</button>
   <div ref={targetRef}>
     Content to be included in the PDF
   </div>
)

}

```

**Using generatedPDF function**

**Using outer target ref**

```jsx
   import { generatePDF } from 'react-to-pdf'

const Component = () => {
    const targetRef = React.createRef();
return (
   <button onClick={() => generatePDF(targetRef)}>Generate PDF</button>
   <div ref={targetRef}>
     Content to be included in the PDF
   </div>
)

}
```

**Advanced options**
```jsx
const ref = React.createRef();
const options = {
    orientation: 'landscape',
    unit: 'in',
    format: [4,2]
};
<div>
    <ReactToPdf targetRef={ref} filename="div-blue.pdf" options={options} x={.5} y={.5} scale={0.8}>
        {({toPdf}) => (
            <button onClick={toPdf}>Generate pdf</button>
        )}
    </ReactToPdf>
    <div style={{width: 500, height: 500, background: 'blue'}} ref={ref}/>
</div>
```

## Props

|Prop name        |Type               |Default            |Description
|-----------------|-------------------|-------------------|--------------------------------
|filename         | `string`          | `'download.pdf'`  | Name of the pdf file
|targetRef        | `RefObject`       |                   | [React ref](https://reactjs.org/docs/refs-and-the-dom.html) for the target component (use this or inner target reference)
|x                | `number`          |         0         | X position in document
|y                | `number`          |         0         | Y position in document
|options          | `object`          |    `undefined`    | options for the jsPdf document - [view more details](https://rawgit.com/MrRio/jsPDF/master/docs/)
|onComplete       | `function`        |    `undefined`    | callback executed when process is finished
|scale            | `number`          |    1              | Image scaling
