import React, {PureComponent} from 'react';
import {findDOMNode} from 'react-dom'
import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class ReactToPdf extends PureComponent {

    constructor(props){
        super(props);
        this.toPdf = this.toPdf.bind(this);
        this.targetRef = React.createRef();
    }

    toPdf(){
        const {targetRef, filename, options, onComplete} = this.props;
        const source = targetRef || this.targetRef;
        if (!source){
            console.log('source is null')
            return;
        }
        html2canvas(source.current)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF(options);
          pdf.addImage(imgData, 'JPEG', 0, 0);
          // pdf.output('dataurlnewwindow');
          pdf.save(filename);
          if (onComplete) onComplete();
        })
      ;
    }

    render(){
        const {children} = this.props;
        return children({toPdf: this.toPdf, targetRef: this.targetRef});
    }

};

ReactToPdf.propTypes = {
    filename: PropTypes.string.isRequired,
};

ReactToPdf.defaultProps = {
    filename: 'download.pdf'
}

export default ReactToPdf;