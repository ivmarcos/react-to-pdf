import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import jsPdf from 'jspdf';
import html2canvas from 'html2canvas';

class ReactToPdf extends PureComponent {

    constructor(props){
        super(props);
        this.toPdf = this.toPdf.bind(this);
    }

    toPdf(){
        const {source, filename, options, onComplete} = this.props;
        html2canvas(input)
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
        return children({toPdf: this.toPdf});
    }

};

ReactToPdf.propTypes = {
    filename: PropTypes.string.isRequired,
};

ReactToPdf.defaultProps = {
    filename: 'download.pdf'
}

export default ReactToPdf;