import React from 'react';
import {Link} from 'react-router-dom';
import {Container, Row, Col, Button, Alert} from 'react-bootstrap';

const PageActionResult = ({title="Niepoprawny link", description = null, alertMessage = null, alertType = "info"}) => {
    return ( 
        <Container className="form-page">
            <Row>
                <Col xs="12" sm="10" md="8" lg="6" xl="5" className="form-col">
                    <div className="form-container">
                        <h1>{title}</h1>
                        {description && <p className="text-muted text-justify">{description}</p>}
                        {alertMessage && <Alert variant={alertType}>{alertMessage}</Alert>}
                        <Button as={Link} to="/" className="w-100" variant="link">Wróć</Button>
                    </div>
                </Col>
            </Row>
        </Container>
     );
}
 
export default PageActionResult;