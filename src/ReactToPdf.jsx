import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import JsPdf from 'jspdf';
import html2canvas from 'html2canvas';

class ReactToPdf extends PureComponent {
  constructor(props) {
    super(props);
    this.toPdf = this.toPdf.bind(this);
    this.toCanvas = this.toCanvas.bind(this);
    this.toSinglePage = this.toSinglePage.bind(this);
    this.toMultiplePage = this.toMultiplePage.bind(this);
    this.getSource = this.getSource.bind(this);
    this.targetRef = React.createRef();
  }

  getSource() {
    const targetRef = this.props.targetRef || this.targetRef;
    if (!targetRef) {
      throw new Error('Target ref must be informed.');
    }
    return targetRef.current || targetRef; // support older React versions
  }

  toSinglePage() {
    const { filename, x, y, options, onComplete } = this.props;
    this.toCanvas().then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new JsPdf(options);
      pdf.addImage(imgData, 'JPEG', x, y);
      console.log('ok');
      pdf.save(filename);
      if (onComplete) onComplete();
    });
  }

  toMultiplePage() {
    const { x, y, filename, options, onComplete } = this.props;
    // const factor = 980;
    const factor = 1000;
    this.toCanvas().then(canvas => {
      const destination = document.getElementById('destination');
      const source = this.getSource();
      console.log('source width', source.clientWidth);
      console.log('source height', source.clientHeight);
      const imgData = canvas.toDataURL('image/png');
      const image = new Image();
      image.src = imgData;
      image.setAttribute('width', source.clientWidth);
      image.setAttribute('height', source.clientHeight);
      image.onload = () => {
        console.log('image height', image.clientHeight);
        const pdf = new JsPdf(options);
        // const sX = 0;
        // const sWidth = 778;
        // const sHeight = 1120;
        // const dX = 0;
        // const dY = 0;
        // const dWidth = 778;
        // const dHeight = 1120;
        const sX = 0;
        const sWidth = source.clientWidth;
        const sHeight = 100;
        const dX = 0;
        const dY = 0;
        const dWidth = sWidth;
        const dHeight = sHeight;
        destination.innerHTML = '';
        const pageSize = 100;
        const sourceHeight = source.clientHeight;
        const pages = sourceHeight / pageSize;
        console.log('pages', pages);
        for (let i = 0; i < pages; i++) {
          const tmpCanvas = document.createElement('canvas');
          tmpCanvas.setAttribute('width', sWidth);
          tmpCanvas.setAttribute('height', sHeight);
          const tmpCtx = tmpCanvas.getContext('2d');
          const sY = 100 * i;
          console.log('cut position', sY);
          tmpCtx.drawImage(image, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
          destination.appendChild(tmpCanvas);
        }
        //        destination.appendChild(image);
      };

      /*
      console.log('clientHeight', source.clientHeight, source);
      for (let i = 0; i <= source.clientHeight / factor; i++) {
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.setAttribute('width', sWidth);
        tmpCanvas.setAttribute('height', sHeight);
        const tmpCtx = tmpCanvas.getContext('2d');
        // const sY = 1120 * i; // start 980 pixels down for every new page
        const sY = factor * i; // start 980 pixels down for every new page
        console.log('chunk', i, sY);
        tmpCtx.drawImage(canvas, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
        const tmpDataUrl = tmpCanvas.toDataURL('image/png', 1.0);
        const width = tmpCanvas.width;
        const height = tmpCanvas.clientHeight;

        //! If we're on anything other than the first page,
        // add another page
        if (i > 0) {
          pdf.addPage();
          // pdf.addPage(595, 842); // 8.5" x 11" in pts (in*72)
        }
        //! now we declare that we're working on that page
        pdf.setPage(i + 1);
        //! now we add content to that page!
        pdf.addImage(tmpDataUrl, 'PNG', 0, 0, width * 0.72, height * 0.71);
        destination.appendChild(tmpCanvas);

        // pdf.addImage(tmpDataUrl, 'PNG', x, y);
      }

      // pdf.save(filename);
      if (onComplete) onComplete(); */
    });
  }

  toCanvas() {
    const source = this.getSource();

    return html2canvas(source.current || source);
  }

  toPdf() {
    const { multiplePage } = this.props;
    const createPage = multiplePage ? this.toMultiplePage : this.toSinglePage;
    createPage();
  }

  render() {
    const { children } = this.props;
    return children({ toPdf: this.toPdf, targetRef: this.targetRef });
  }
}

ReactToPdf.propTypes = {
  filename: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  options: PropTypes.object,
  children: PropTypes.func.isRequired,
  multiplePage: PropTypes.bool.isRequired
};

ReactToPdf.defaultProps = {
  filename: 'download.pdf',
  x: 0,
  y: 0,
  multiplePage: true
};

export default ReactToPdf;
