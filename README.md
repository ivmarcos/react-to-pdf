# ReactToPdf

Easily create pdf documents from react components.

## Install

```
$ npm install react-to-pdf
```

## Usage

**Using inner target ref**

```jsx
<ReactToPdf>
    {({toPdf, targetRef}) =>  (
        <div style={{width: 500, height: 500, background: 'red'}} onClick={toPdf} ref={targetRef}/>
    )}
</ReactToPdf>
```

**Using outer target ref**

```jsx
const ref = React.createRef();

<div>
    <ReactToPdf targetRef={ref} filename="div-blue.pdf">
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
|targetRef        | `string`          |                   | Reference for the target component (use this or inner target reference)
