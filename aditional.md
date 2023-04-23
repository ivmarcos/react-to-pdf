## New Features

- React 18 support
- Multipage support
- Supports opening the PDF in the browser via the method `open`. The `build` method can be used to just return the built PDF.
- Possible to easily set the quality of the image used in the PDF using the `resolution` option.
- Margin is now easier to set using the `margin` option, either by setting values especifically for each point (top, bottom, left, right) or a general value for all points.
- Possible to override or customize values also passed for the html2canvas function.

## Breaking Changes

- The main change: the wrapper react component no longer exists. Use either the default function or the `usePDF` hook. See below an example on how to migrate from the v0 to v1;
- The following props were not included in the 1.x available options:
  - `scale` - not supported
  - `x` - Use `margin` param instead
  - `y` - Use `margin` param instead
  - `onComplete` - The default function and the `toPDF` function returned in the `usePDF` hook returns a Promise that can be used instead

### Migrating from v0 to v1:

Before (v0):

```jsx
import ReactToPdf from 'react-to-pdf'
const Component = () => (
    const handleComplete = () => {
        console.log('PDF has been generated')
    }
    return (
        <ReactToPdf targetRef={ref} filename="page.pdf" options={{compress: true}} x={5} y={5} onComplete={handleComplete}>
            {({toPdf, targetRef}) =>  (
                <div>
                    <button onClick={toPdf}>Generate PDF</button>
                    <div ref={targetRef}>
                        Content to be included in the PDF
                    </div>
                </div>
            )}
        </ReactToPdf>
    )
)
```

After (v1):

```jsx
import generatePDF from 'react-to-pdf'

const Component = () => (
    const targetRef = React.createRef();
    const options = {
        filename: 'page.pdf',
        page: {
            margin: 5
        },
        overrides: {
            pdf: {
                compress: true
            }
        }
    }
    const handleGeneratePDF = async () => {
        await generatePDF(targetRef, options);
        console.log('PDF has been generated')
    }
    return (
        <div>
            <button onClick={handleGeneratePDF}>Generate PDF</button>
            <div ref={targetRef}>
                Content to be included in the PDF
            </div>
        </div>
    )
)
```
