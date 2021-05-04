import React, { useEffect, useState } from 'react';

import PageActionResult from './PageActionResult';

import { useLoading } from '../contexts/LoadingContext';
import { useAuth } from '../contexts/AuthContext';

const PageVerifyEmail = ({codeInfo, urlParams}) => {

    const [alertType, setAlertType] = useState('danger');
    const [alertMessage, setAlertMessage] = useState('');
    
    const {setIsLoading} = useLoading();
    const {verifyEmail} = useAuth();
    
    const oobCode = urlParams.get('oobCode');

    useEffect(async ()=>{
        try {
            await verifyEmail(oobCode);
            setAlertType('success');
            setAlertMessage('Konto zostało poprawnie aktywowane.');
        } catch(err) {
            setAlertType('danger');
            setAlertMessage(err.message);
        }
        setIsLoading(false);
    },[]);

    return ( 
        <PageActionResult title="Dziękujemy" alertType={alertType} alertMessage={alertMessage} />
     );
}
 
export default PageVerifyEmail;