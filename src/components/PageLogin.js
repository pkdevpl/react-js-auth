import React, {useRef, useState, useEffect} from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLoading } from '../contexts/LoadingContext';


const PageLogin = () => {

    const formRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    
    const [showPassword, setShowPassword] = useState();
    const [alertMessage, setAlertMessage] = useState();
    const [alertType, setAlertType] = useState();
    
    const {setIsLoading, setLoadingContent} = useLoading();
    const {loginUser} = useAuth();

    useEffect(()=>{
        setIsLoading(false);
    },[]);

    const handleLogin = async event => {
        event.preventDefault();
        event.stopPropagation();
        
        setAlertMessage('');
        setLoadingContent('Logowanie na konto');
        setIsLoading(true);

        try {
            await loginUser(emailRef.current.value, passwordRef.current.value);
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
                        <h1>Zaloguj się</h1>
                        <p className="text-muted text-justify">Uzupełnij poniższe pola, aby zalogować się na swoje konto.</p>
                        {alertMessage && <Alert variant={alertType}>{alertMessage}</Alert>}
                        <Form onSubmit={handleLogin} ref={formRef}>
                            <Form.Group>
                                <Form.Control type="email" placeholder="Adres e-mail" required ref={emailRef} />
                            </Form.Group>
                            <Form.Group>
                                <InputGroup>
                                    <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Hasło" required ref={passwordRef} />
                                    <InputGroup.Append>
                                        <Button 
                                            as={InputGroup.Text} 
                                            onClick={()=>setShowPassword(!showPassword)} 
                                            variant="link">{showPassword ? <EyeSlash /> : <Eye />}</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group>
                                <Button className="w-100" type="submit" variant="primary">Zaloguj się</Button>
                            </Form.Group>
                            <Form.Group>
                                <Button as={Link} to="/utworz-konto" className="w-100" variant="link">Utwórz nowe konto</Button>
                                <Button as={Link} to="/zresetuj-haslo" className="w-100" variant="link">Przypomnij hasło</Button>
                            </Form.Group>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
 
export default PageLogin;