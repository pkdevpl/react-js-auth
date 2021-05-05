import React, {useRef, useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button, InputGroup, Alert, Overlay, Tooltip} from 'react-bootstrap';
import {Files, Eye, EyeSlash} from 'react-bootstrap-icons';
import {Link, useHistory} from 'react-router-dom';
import {useLoading} from '../contexts/LoadingContext';
import {useAuth} from '../contexts/AuthContext';

const PageRegister = () => {

    // Refs

    const formRef = useRef();
    
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const copyPasswordRef = useRef();

    // States
    
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('info');    
    const [showPassword, setShowPassword] = useState();
    
    
    // Contexts

    const {setIsLoading, setLoadingContent} = useLoading();
    const {createUser} = useAuth();

    const history = useHistory();

    useEffect(()=>{
        setIsLoading(false);
    },[]);
    
    const copyPassword = () => {
        passwordRef.current.select();
        document.execCommand('copy');
    }
    
    const handleRegister = async event => {
        event.preventDefault();
        event.stopPropagation();
        
        passwordRef.current.classList.remove('is-invalid');
        passwordConfirmRef.current.classList.remove('is-invalid');
        
        setAlertMessage('');
        
        if(passwordRef.current.value !== passwordConfirmRef.current.value) {
            passwordRef.current.classList.add('is-invalid');
            passwordConfirmRef.current.classList.add('is-invalid');
            return;
        }

        setLoadingContent('Tworzenie konta użytkownika');
        setIsLoading(true);

        try {
            const emailVal = emailRef.current.value;
            const passwordVal =  passwordRef.current.value;
            const firstNameVal = firstNameRef.current.value;
            const lastNameVal =  lastNameRef.current.value;

            await createUser(emailVal, passwordVal, firstNameVal, lastNameVal);
            formRef.current.reset();
            history.push("/");
        } catch(err) {
            setAlertMessage(err.message);
            setAlertType('danger');
            setIsLoading(false);
        }
    }

    return (
        <Container className="form-page additional-padding">
            <Row className="mt-n4">
                <Col xs="12" sm="10" md="8" lg="6" xl="5" className="form-col">
                    <div className="form-container">
                        <h1>Utwórz konto</h1>
                        <p className="text-muted text-justify">Uzupełnij poniższe pola, aby utworzyć konto użytkownika.</p>
                        {alertMessage && <Alert variant={alertType}>{alertMessage}</Alert>}
                        <Form onSubmit={handleRegister} ref={formRef}>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Imię" required ref={firstNameRef} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Nazwisko" required ref={lastNameRef} />
                            </Form.Group>
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
                                    <InputGroup.Append>
                                        <Button ref={copyPasswordRef} as={InputGroup.Text} onClick={copyPassword} variant="link" title="Kopiuj do schowka">
                                            {/* {passwordCopied ? <CheckSquareFill color="#28a05e" /> : <Files />} */}
                                            <Files />
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Powtórz hasło" required ref={passwordConfirmRef} />
                                <Form.Control.Feedback type="invalid">Podane hasła muszą być jednakowe</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Button className="w-100" type="submit" variant="primary">Utwórz konto</Button>
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
 
export default PageRegister;