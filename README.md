# React to PDF

Easily create PDF documents from React components.

## Install

```
# Yarn
yarn add react-to-pdf

# NPM
npm install --save react-to-pdf
```

## Important Notes

- Not vectorized - the pdf is created from a screenshot of the component and therefore is not vectorized. If you are looking for something more advanced to generate pdf using React components, please check out other popular alternatives packages listed below.
- No SSR

## Alternatives and Similars Packages

- [@react-pdf/renderer](https://www.npmjs.com/package/@react-pdf/renderer) - React renderer to create PDF files on the browser and server
- [react-pdf](https://www.npmjs.com/package/react-pdf) - Display PDFs in your React app as easily as if they were images.


## Examples

- [Stackblitz demo](https://stackblitz.com/edit/vitejs-vite-sd71svw8?file=src%2FApp.tsxx)
- [Using `usePDF` hook](https://github.com/ivmarcos/react-to-pdf/blob/main/examples/ExampleUsePDF.tsx) 
- [Using default function](https://github.com/ivmarcos/react-to-pdf/blob/main/examples/ExampleFunction.tsx) 
- [Multipage support](https://github.com/ivmarcos/react-to-pdf/blob/main/examples/ExampleMultipage.tsx) 
- [Advanced options](https://github.com/ivmarcos/react-to-pdf/blob/main/examples/ExampleAdvanced.tsx) 

## Usage

**Using `usePDF` hook**

```jsx
import { usePDF } from 'react-to-pdf';

const Component = () => {
   const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
   return (
      <div>
         <button onClick={() => toPDF()}>Download PDF</button>
         <div ref={targetRef}>
            Content to be generated to PDF
         </div>
      </div>
   )
}
```
[Stackblitz demo](https://stackblitz.com/edit/vitejs-vite-sd71svw8?file=src%2FApp.tsx)


**Using default function**

```jsx
import { useRef } from 'react';
import generatePDF from 'react-to-pdf';

const Component = () => {
   const targetRef = useRef();
   return (
      <div>
         <button onClick={() => generatePDF(targetRef, {filename: 'page.pdf'})}>Download PDF</button>
         <div ref={targetRef}>
            Content to be included in the PDF
         </div>
      </div>
   )
}
```
[Stackblitz demo](https://stackblitz.com/edit/vitejs-vite-zmjvmgft?file=src%2FApp.tsx)

**Advanced options**

```jsx
import generatePDF, { Resolution, Margin } from 'react-to-pdf';

const options = {
   // default is `save`
   method: 'open',
   // default is Resolution.MEDIUM = 3, which should be enough, higher values
   // increases the image quality but also the size of the PDF, so be careful
   // using values higher than 10 when having multiple pages generated, it
   // might cause the page to crash or hang.
   resolution: Resolution.HIGH,
   page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.SMALL,
      // default is 'A4'
      format: 'letter',
      // default is 'portrait'
      orientation: 'landscape',
   },
   canvas: {
      // default is 'image/jpeg' for better size performance
      mimeType: 'image/png',
      qualityRatio: 1
   },
   // Customize any value passed to the jsPDF instance and html2canvas
   // function. You probably will not need this and things can break, 
   // so use with caution.
   overrides: {
      // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
      pdf: {
         compress: true
      },
      // see https://html2canvas.hertzen.com/configuration for more options
      canvas: {
         useCORS: true
      }
   },
};

// you can use a function to return the target element besides using React refs
const getTargetElement = () => document.getElementById('content-id');

const Component = () => {
   return (
      <div>
         <button onClick={() => generatePDF(getTargetElement, options)}>Generate PDF</button>
         <div id="content-id">
            Content to be generated to PDF
         </div>
      </div>
   );
}
```
[Stackblitz demo](https://stackblitz.com/edit/vitejs-vite-anpe7vdv?file=src%2FApp.tsx)