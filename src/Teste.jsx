import React, { Component } from 'react';
import PropTypes from 'prop-types';
import html2canvas from 'html2canvas';

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

function test(ref) {
  const source = ref.current;
  html2canvas(source).then(canvas => {
    const destination = document.getElementById('destination');
    console.log('source width', canvas.width);
    console.log('source height', canvas.height);
    // const pdf = new JsPdf(options);
    // const sX = 0;
    // const sWidth = 778;
    // const sHeight = 1120;
    // const dX = 0;
    // const dY = 0;
    // const dWidth = 778;
    // const dHeight = 1120;
    const sX = 0;
    const sWidth = canvas.width;
    const sHeight = 100;
    const dX = 0;
    const dY = 0;
    const dWidth = sWidth;
    const dHeight = sHeight;
    destination.innerHTML = '';
    const pageSize = 100;
    const pages = canvas.height / pageSize;
    console.log('pages', pages);
    for (let i = 0; i < pages; i++) {
      const tmpCanvas = document.createElement('canvas');
      tmpCanvas.setAttribute('width', sWidth);
      tmpCanvas.setAttribute('height', sHeight);
      const tmpCtx = tmpCanvas.getContext('2d');
      const sY = 100 * i;
      console.log('cut position', sY);
      tmpCtx.drawImage(canvas, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
      destination.appendChild(tmpCanvas);
    }
  });
}
class Teste extends Component {
  render() {
    return (
      <div>
        <div id="destination" />
        <button onClick={() => test(ref)}>test</button>
        <div ref={ref} style={style.container}>
          <div style={style.blue} />
          <div style={style.green} />
          <div style={style.red} />
        </div>
      </div>
    );
  }
}

Teste.propTypes = {};

export default Teste;
