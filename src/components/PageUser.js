import React, {useRef, useState, useEffect} from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { useLoading } from '../contexts/LoadingContext';
import { useAuth } from '../contexts/AuthContext';


const PageUser = () => {

    const [alertMessage, setAlertMessage] = useState();
    const [alertType, setAlertType] = useState();
    
    const {setIsLoading, setLoadingContent} = useLoading();
    const {logoutUser} = useAuth();

    useEffect(()=>{
        setIsLoading(false);
    },[]);

     
    return ( 
        <Container className="form-page">
            <Row>
                <Col xs="12" sm="10" md="8" lg="6" xl="5" className="form-col">
                    <div className="form-container">
                        <h1>Witaj!</h1>
                        <p className="text-muted text-justify">To jest strona zalogowanego użytkownika. Możesz zmienić ją na bardziej przydatną.</p>
                        {alertMessage && <Alert variant={alertType}>{alertMessage}</Alert>}
                        <Button className="w-100 mt-2 mb-4" variant="primary" onClick={logoutUser}>Wyloguj się</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
 
export default PageUser;