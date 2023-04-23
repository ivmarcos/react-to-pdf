# React to PDF

Easily create pdf documents from React components.

## Install

```
$ npm install react-to-pdf
```

## Important Notes

- Not vectorized - the pdf is created from a screenshot of the component and therefore is not vectorized. If you are looking for something more advanced for generating pdf using React components, please check out other popular alternatives packages listed below.
- No SSR

## Alternatives and Similars Packages

* [@react-pdf/renderer](https://www.npmjs.com/package/@react-pdf/renderer) - React renderer for creating PDF files on the browser and server
* [react-pdf](https://www.npmjs.com/package/react-pdf) - Display PDFs in your React app as easily as if they were images.


## Examples


## Usage

**Default method**

```jsx
   import generatePDF from 'react-to-pdf'

const Component = () => {
    const targetRef = React.createRef();
return (
   <button onClick={() => generatePDF(targetRef, {filename: 'page.pdf'})}>Download PDF</button>
   <div ref={targetRef}>
     Content to be included in the PDF
   </div>
)

}
```

**Using hook**

```jsx
   import { usePDF } from 'react-to-pdf'

const Component = () => {
   const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});

return (
   <button onClick={toPDF}>Download PDF</button>
   <div ref={targetRef}>
     Content to be included in the PDF
   </div>
)

}

```


**Advanced options**
```jsx
   import { usePDF } from 'react-to-pdf'

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

