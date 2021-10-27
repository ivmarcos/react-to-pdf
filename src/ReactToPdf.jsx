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
    const targetComponent = source.current || source;
    if (!targetComponent) {
      throw new Error(
        'Target ref must be used or informed. See https://github.com/ivmarcos/react-to-pdf#usage.'
      );
    }
    html2canvas(targetComponent, {
      logging: false,
      useCORS: true,
      scale: this.props.scale
    }).then(canvas => {
      let imgData = canvas.toDataURL('image/png');
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let doc = new JsPdf(options);
      let position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save(filename);
      if (onComplete) onComplete();
    });
  }

  render() {
    const { children } = this.props;
    return children({ toPdf: this.toPdf, targetRef: this.targetRef });
  }
}

ReactToPdf.propTypes = {
  filename: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  imgWidth: PropTypes.number,
  pageHeight: PropTypes.number,
  options: PropTypes.shape({}),
  scale: PropTypes.number,
  children: PropTypes.func.isRequired,
  onComplete: PropTypes.func,
  targetRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

ReactToPdf.defaultProps = {
  filename: 'download.pdf',
  options: undefined,
  x: 0,
  y: 0,
  imgWidth: 300,
  pageHeight: 300,
  scale: 1,
  onComplete: undefined,
  targetRef: undefined
};

export default ReactToPdf;
