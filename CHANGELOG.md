# 2.0.1 (June, 3, 2025)

Fixes security vulnerabilities from tar-fs and some other minor changes related to Vite bumps.

* add nvmrc file (8abe51d)
* add nvmrc file (2260c0c)
* Bump tar-fs from 2.1.2 to 2.1.3 (#159) (c1cc4e7)
* Bump vite from 6.2.6 to 6.2.7 (#158) (eee4dc1)
* Bump vite from 6.2.5 to 6.2.6 (#157) (e6a1555)
* Bump vite from 6.2.4 to 6.2.5 (#155) (6fefc56)
* Bump vite from 6.2.3 to 6.2.4 (#154) (0c09957)
* update changelog (f56dd81)

# 2.0.0 (March, 28, 2025)

This release fix some security vulnerabilities related to jspdf. https://github.com/parallax/jsPDF/releases/tag/v3.0.1. This major release follows jspdf major release v3 which dropped support for Internet Explorer and fixed a security vulnerability in the html function by updating the optional dependency dompurify to v3.2.4. 

There are no other breaking changes.

* update links (2605643)
* update changelog (d9e6d0d)

# 2.0.0-beta.0 (March, 28, 2025)

* Prepare release 2 beta (#153) (bad7181)
* Switch to vite (#152) (f6f7ea5)
* Bump release-it and canva (#151) (0c85ca3)
* Bump jspdf from 2.5.1 to 3.0.1 (#150) (4f9f7f9)
* Bump msgpackr from 1.8.5 to 1.10.1 (#107) (094c0ee)
* Bump ip from 1.1.8 to 1.1.9 (#115) (a01f348)
* Bump @babel/traverse from 7.21.4 to 7.23.2 (#90) (195760f)
* Use alias for examples (#81) (6552d8b)
* update changelog and add release script (562e695)

# 1.0.1 (September, 7, 2023)

* fix broken build (076e1ad)
* update docs (076e1ad)
* update changelog (076e1ad)

# 1.0.0 (September, 7, 2023)

* update readme (ced5bd5)
* Add Cypress tests  (#80) (42f19fa)
* add codesandbox examples (79d4272)
* update changelog (a8028f1)

# 1.0.0-alpha.1 (September 2, 2023)

* fix examples broken links (85dee13)
* Fix method update and add more examples (#78) (d94c930)
* fix wrong default method that should be save (f4bdf69)
* Bump tough-cookie from 4.1.2 to 4.1.3 (#76) (6ee98c4)
* Bump word-wrap from 1.2.3 to 1.2.5 (#75) (13a4d7a)
* Bump semver from 5.7.1 to 5.7.2 (#77) (05a15ab)
* remove node 14 from ci (693eb8d)
* upgrade dep and changelog (ef85689)
* remove aditional file (acd4622)
* update changelog and remove example from npm (b8632b3)

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
