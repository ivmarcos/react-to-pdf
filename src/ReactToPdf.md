Using inner target ref

```jsx
const React = require('react');
<ReactToPdf>
    {({toPdf, targetRef}) => <div style={{width: 500, height: 500, background: 'red'}} onClick={toPdf} ref={targetRef}/>}
</ReactToPdf>
```

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