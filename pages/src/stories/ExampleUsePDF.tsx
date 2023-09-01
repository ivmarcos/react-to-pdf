import { Margin, usePDF } from 'react-to-pdf';
import { Card } from './Card';
import { Button } from './Button';
import { Container } from './Container';

export const ExampleUsePDF = () => {
    const {toPDF, targetRef} = usePDF({method: 'save', filename: 'usepdf-example.pdf', page: {margin: Margin.MEDIUM}});
    return (
        <Container>
            <Button onClick={toPDF}>Download PDF</Button>
            <div ref={targetRef} >
                <Card imageId={22} title="usePDF hook example"/>
            </div>
        </Container>
     )
}