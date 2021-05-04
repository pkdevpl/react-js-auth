import React, {useState} from 'react';
import {Container, Row, Spinner} from 'react-bootstrap';

const LoadingContext = React.createContext();

export const useLoading = () => {
    return React.useContext(LoadingContext);
};

const LoadingProvider = ({children}) => {
    

    const [isLoading, setIsLoading] = useState(true);
    const [loadingContent, setLoadingContent] = useState('To może chwilę potrwać');
    const [loadingTitle, setLoadingTitle] = useState('Ładowanie');
    
    const showLoadingScreen = (content, title="Ładowanie") => {
        setLoadingTitle(title);
        setLoadingContent(content);
        setIsLoading(true);
    };

    const value = {
        isLoading,
        showLoadingScreen,
        setIsLoading,
        setLoadingContent,
        setLoadingTitle
    }

    return ( 
        <LoadingContext.Provider value={value}>
            {children}
            {isLoading && (
                <Container fluid style={{position: 'fixed', top: 0, left: 0, zIndex: 10}} className="bg-main-bg form-page vh-100">
                    <Row className="text-center">
                        <div className="loading-container text-muted">
                            <h1>{loadingTitle}</h1>
                            <p>{loadingContent}</p>
                            <Spinner animation="border" />
                        </div>        
                    </Row>
                </Container>
            )}
        </LoadingContext.Provider>
     );
}
 
export default LoadingProvider;