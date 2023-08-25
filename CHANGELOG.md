# 1.0.0-alpha.0 (August 26, 2023)

## New Features

- React 18 support
- Multipage support
- Typescript
- Supports opening the PDF in the browser via the method `open`. The `build` method can be used to just return the built PDF.
- Possible to set the quality of the image using the `resolution` option.
- Margin is now easier to set using the `margin` option, either by setting values especifically for each point (top, bottom, left, right) or a general value for all points.
- Possible to override or customize values also passed for the `html2canvas`` function.

## Breaking Changes

- The wrapper react component no longer exists. Use either the default function or the `usePDF` hook. See below an example on how to migrate from the v0 to v1;
- The following props were not included in the 1.x available options:
  - `scale` - not supported, if you want to get a higher PDF resolution, use the `resolution` option instead
  - `x` - Use `margin` param instead
  - `y` - Use `margin` param instead
  - `onComplete` - The default function and the `toPDF` function returned in the `usePDF` hook returns a `Promise` that can be awaited instead of the `onComplete` callback

## Migrating from v0 to v1:

Before (v0):

```jsx
import ReactToPdf from 'react-to-pdf'
const Component = () => (
    const handleComplete = () => {
        console.log('PDF has been generated')
    }
    return (
        <ReactToPdf filename="page.pdf" options={{compress: true}} x={5} y={5} onComplete={handleComplete}>
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
import { usePDF }  from 'react-to-pdf'

const Component = () => (
    const { toPDF, targetRef } = usePDF();
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
        await toPDF(options);
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

# 0.0.14 (May 18, 2021)

- Upgraded JsPdf

# 0.0.13 (September 2, 2020)

- Fixed UMD configuration

# 0.0.12 (September 2, 2020)

- Upgraded eslint
- Fixed conflicted code in source
- Const to var in index
- Support UMD

# 0.0.11

Initial public released
