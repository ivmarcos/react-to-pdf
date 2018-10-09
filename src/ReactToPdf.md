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
<ReactToPdf targetRef={ref} filename="div-blue.pdf">
    {({toPdf}) => <div style={{width: 500, height: 500, background: 'blue'}} onClick={toPdf} ref={ref}/>}
</ReactToPdf>
```