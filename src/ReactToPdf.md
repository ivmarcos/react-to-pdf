## Props

|Prop name        |Type               |Default            |Description
|-----------------|-------------------|-------------------|--------------------------------
|filename         | `string`          | `'download.pdf'`  | Name of the pdf file
|targetRef        | `string`          |                   | Reference for the target component (use this or inner target reference)
|x                | `number`          |         0         | X position in document
|y                | `number`          |         0         | Y position in document
|options          | `number`          |         0         | options for the jsPdf document - [view more details](https://rawgit.com/MrRio/jsPDF/master/docs/)



**Using outer target ref**

```jsx
const React = require('react');
const ref = React.createRef();
const style = {
    container: {
        background: 'yellow'
    },
    red: {
        width: 500,
        height: 1000,
        background: 'red'
    },
    green: {
        width: 500,
        height: 1000,
        background: 'green'
    },
    blue: {
        width: 500,
        height: 1000,
        background: 'blue'
    }
};
<div>
    <div id="destinationass">
    </div>
    <ReactToPdf targetRef={ref} filename="div-blue.pdf">
        {({toPdf}) => (
            <button onClick={toPdf}>Generate pdf</button>
        )}
    </ReactToPdf>
    <div ref={ref} style={style.container}>
        <div style={style.blue}/>
        <div style={style.green}/>
        <div style={style.red}/>
    </div>

</div>
```

**Using inner target ref**

```jsx
const React = require('react');
const style = {
    width: 500,
    height: 3000,
    background: 'red'
};
<ReactToPdf>
    {({toPdf, targetRef}) => <div style={style} onClick={toPdf} ref={targetRef}/>}
</ReactToPdf>
```


**Advanced options**
```jsx
const ref = React.createRef();
const options = {
    orientation: 'landscape',
    unit: 'in',
    format: [4,2]
};
const style = {
    width: 500,
    height: 3000,
    background: 'blue'
};
<div>
    <ReactToPdf targetRef={ref} filename="div-blue.pdf" options={options} x={.5} y={.5}>
        {({toPdf}) => (
            <button onClick={toPdf}>Generate pdf</button>
        )}
    </ReactToPdf>
    <div style={style} ref={ref}/>
</div>
```