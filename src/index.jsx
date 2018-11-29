import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import JsPdf from 'jspdf';
import html2canvas from 'html2canvas';

class ReactToPdf extends PureComponent {
  constructor(props) {
    super(props);
    this.toPdf = this.toPdf.bind(this);
    this.targetRef = React.createRef();
  }

  toPdf() {
    const { targetRef, filename, x, y, options, onComplete } = this.props;
    const source = targetRef || this.targetRef;
    if (!source) {
      console.log('source is null');
      return;
    }
    html2canvas(source.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new JsPdf(options);
      pdf.addImage(imgData, 'JPEG', x, y);
      pdf.save(filename);
      if (onComplete) onComplete();
    });
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
  children: PropTypes.func.isRequired
};

ReactToPdf.defaultProps = {
  filename: 'download.pdf',
  x: 0,
  y: 0
};

export default ReactToPdf;
