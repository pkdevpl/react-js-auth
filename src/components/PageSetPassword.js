import React, {useRef, useState, useEffect} from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useLoading } from '../contexts/LoadingContext';
import { useAuth } from '../contexts/AuthContext';


const PageSetPassword = ({codeInfo, urlParams}) => {

    const formRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    
    const [showPassword, setShowPassword] = useState();
    const [alertMessage, setAlertMessage] = useState();
    const [alertType, setAlertType] = useState();
    const [disabled, setDisabled] = useState(false);
    
    const {setIsLoading, setLoadingContent} = useLoading();
    const {setPassword} = useAuth();

    useEffect(async ()=>{
        console.log(urlParams);
        setIsLoading(false);
    },[]);


    const handlePasswordChange = async event => {
        event.preventDefault();
        event.stopPropagation();

        if(passwordRef.current.value !== passwordConfirmRef.current.value) {
            passwordRef.current.classList.add('is-invalid');
            passwordConfirmRef.current.classList.add('is-invalid');
            return;
        }
        
        setAlertMessage('');
        setLoadingContent('Ustawianie hasła');
        setIsLoading(true);

        try {
            await setPassword(urlParams.get('oobCode'), passwordRef.current.value);
            formRef.current.reset();
            setAlertMessage('Hasło zostało zmienione. Możesz bezpiecznie zalogować się na swoje konto.');
            setAlertType('success');
            setIsLoading(false);
            setDisabled(true);
        } catch(err) {
            setAlertMessage(err.message);
            setAlertType('danger');
            setIsLoading(false);
        }
    }
     
    return ( 
        <Container className="form-page">
            <Row>
                <Col xs="12" sm="10" md="8" lg="6" xl="5" className="form-col">
                    <div className="form-container">
                        <h1>Ustaw nowe hasło</h1>
                        {!disabled && <p className="text-muted text-center">Wprowadź nowe hasło dla swojego konta.</p>}
                        {alertMessage && <Alert variant={alertType}>{alertMessage}</Alert>}
                        <Form onSubmit={handlePasswordChange} ref={formRef}>
                            {!disabled && (
                                <>
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
                                        <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Powtórz hasło" required ref={passwordConfirmRef} />
                                        <Form.Control.Feedback type="invalid">Podane hasła muszą być jednakowe</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <Button disabled={disabled} className="w-100" type="submit" variant="primary">Ustaw hasło</Button>
                                    </Form.Group>
                                </>
                            )}
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
 
export default PageSetPassword;