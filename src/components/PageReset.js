import React, {useRef, useState, useEffect} from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link} from 'react-router-dom';
import { useLoading } from '../contexts/LoadingContext';
import { useAuth } from '../contexts/AuthContext';

const PageLogin = () => {

    const formRef = useRef();

    const emailRef = useRef();
    
    const [alertMessage, setAlertMessage] = useState();
    const [alertType, setAlertType] = useState();
    
    const {setIsLoading, setLoadingContent} = useLoading();
    const {resetPassword} = useAuth();

    useEffect(()=>{
        setIsLoading(false);
    },[]);

    const handleReset = async event => {
        event.preventDefault();
        event.stopPropagation();
        
        setAlertMessage('');
        setLoadingContent('Resetowanie hasła');
        setIsLoading(true);

        try {
            await resetPassword(emailRef.current.value);
            formRef.current.reset();
            setAlertMessage(`Wysłaliśmy dalsze instrukcje na podany adres e-mail.`);
            setAlertType('success');
            setIsLoading(false);
        } catch(err) {
            setIsLoading(false);
            setAlertMessage(err.message);
            setAlertType('danger');
        }
    }
     
    return ( 
        <Container className="form-page">
            <Row>
                <Col xs="12" sm="10" md="8" lg="6" xl="5" className="form-col">
                    <div className="form-container">
                        <h1>Zresetuj hasło</h1>
                        <p className="text-muted text-justify">Wprowadź adres e-mail powiązany z kontem użytkownika, aby otrzymać link do zresetowania hasła.</p>
                        {alertMessage && <Alert variant={alertType}>{alertMessage}</Alert>}
                        <Form onSubmit={handleReset} ref={formRef}>
                            <Form.Group>
                                <Form.Control type="email" placeholder="Adres e-mail" required ref={emailRef} />
                            </Form.Group>
                            <Form.Group>
                                <Button className="w-100" type="submit" variant="primary">Wyślij link</Button>
                            </Form.Group>
                            <Form.Group>
                                <Button as={Link} to="/zaloguj" className="w-100" variant="link">Wróć do logowania</Button>
                            </Form.Group>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
 
export default PageLogin;