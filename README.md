# React to PDF

Easily create pdf documents from React components.

## Install

```
$ npm install react-to-pdf
```

## Important Notes

- Not vectorized - the pdf is created from a screenshot of the component and therefore is not vectorized. If you are looking for something more advanced to generate pdf using React components, please check out other popular alternatives packages listed below.
- No SSR

## Alternatives and Similars Packages

- [@react-pdf/renderer](https://www.npmjs.com/package/@react-pdf/renderer) - React renderer to create PDF files on the browser and server
- [react-pdf](https://www.npmjs.com/package/react-pdf) - Display PDFs in your React app as easily as if they were images.

## Usage

**Basic**

```jsx
import generatePDF from 'react-to-pdf';

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
import { usePDF } from 'react-to-pdf';

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
import createPDF, { Resolution, Margin } from 'react-to-pdf';

const options = {
   // default is `save`
   method: 'open',
   // default is Resolution.MEDIUM = 3, which should be enough, higher values 
   // increases the image quality but also the size of the PDF, so be careful 
   // using values higher than 10 when having multiple pages generated, it 
   // might cause the browser to crash or hang.
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
      mimeType: 'image/png'
      qualityRatio: 1
   },
   // customize any value passed for the jsPDF instance and html2canvas 
   // function - you should not need this, use with caution.
   overrides: {
      // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
      pdf: {
         compress: true
      },
      // see https://html2canvas.hertzen.com/configuration for more options
      canvas: {
         useCORS: false
      }
   },
};

const Component = () => {
   // you can use a function to return the target element besides using React refs
   const getTargetElement = () => document.getElementById('content-id');
   return (
      <button onClick={() => createPDF(getTargetElement, options)}>Generate PDF</button>
      <div id="content-id">
         Content to be included in the PDF
      </div>
   );
}
```
