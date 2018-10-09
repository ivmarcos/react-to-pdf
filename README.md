# ReactToPdf

Easily create pdf documents from react components.

## Install

```
$ npm install react-to-pdf
```

## Usage

Using inner target ref

```jsx
<ReactToPdf>
    {({toPdf, targetRef}) =>  (
        <div style={{width: 500, height: 500, background: 'red'}} onClick={toPdf} ref={targetRef}/>
    )}
</ReactToPdf>
```

Using outer target ref

```jsx
<ReactToPdf targetRef={ref} filename="div-blue.pdf">
    {({toPdf}) => (
        <div style={{width: 500, height: 500, background: 'blue'}} onClick={toPdf} ref={ref}/>
    )}
</ReactToPdf>
```

Props