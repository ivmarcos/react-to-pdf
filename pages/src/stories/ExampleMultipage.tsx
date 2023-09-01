import { Margin, usePDF } from 'react-to-pdf';
import { Card } from './Card';
import { Button } from './Button';
import { Container } from './Container';

export const ExampleMultipage = () => {
    const {toPDF, targetRef} = usePDF({method: 'save', filename: 'multipage-example.pdf', page: {margin: Margin.MEDIUM}});
    return (
        <Container>
            <Button onClick={toPDF}>Download PDF</Button>
            <div ref={targetRef} >
                {Array(10).fill(0).map((_, index) => <Card imageId={30+index} key={index} title={`Multipage support, card #${index+1}`}/>)}
            </div>
        </Container>
     )
}