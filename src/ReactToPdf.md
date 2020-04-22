## Props

|Prop name        |Type               |Default            |Description
|-----------------|-------------------|-------------------|--------------------------------
|filename         | `string`          | `'download.pdf'`  | Name of the pdf file
|targetRef        | `RefObject`       |                   | [React ref](https://reactjs.org/docs/refs-and-the-dom.html) for the target component (use this or inner target reference)
|x                | `number`          |         0         | X position in document
|y                | `number`          |         0         | Y position in document
|options          | `object`          |    `undefined`    | options for the jsPdf document - [view more details](https://rawgit.com/MrRio/jsPDF/master/docs/)
|onComplete       | `function`        |    `undefined`    | callback executed when process is finished

**Using inner target refsss**

```jsx
const React = require('react');
<ReactToPdf>
    {({toPdf, targetRef}) => <div style={{width: 500, height: 500, background: 'red'}} onClick={toPdf} ref={targetRef}/>}
</ReactToPdf>
```

**Using outer target ref**

```jsx
const React = require('react');
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

**Advanced options**
```jsx
const ref = React.createRef();
const options = {
    orientation: 'landscape',
    unit: 'in',
    format: [4,2]
};
<div>
    <ReactToPdf targetRef={ref} filename="div-blue.pdf" options={options} x={.5} y={.5}>
        {({toPdf}) => (
            <button onClick={toPdf}>Generate pdf</button>
        )}
    </ReactToPdf>
    <div style={{width: 500, height: 500, background: 'blue'}} ref={ref}/>
</div>
```

**Cors***
```jsx
const ref = React.createRef();
<div>
    <ReactToPdf targetRef={ref} filename="div-cors.pdf" >
        {({toPdf}) => (
            <button onClick={toPdf}>Generate pdf</button>
        )}
    </ReactToPdf>
    <div ref={ref}>
        <img
            src="https://s.ftcdn.net/v2013/pics/all/curated/RKyaEDwp8J7JKeZWQPuOVWvkUjGQfpCx_cover_580.jpg?r=1a0fc22192d0c808b8bb2b9bcfbf4a45b1793687"
            className={""}
            alt=""
            crossOrigin="anonymous"
        />
    </div>
</div>
```


