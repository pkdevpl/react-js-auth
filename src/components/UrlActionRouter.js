import React, { useEffect, useState } from 'react';
import {Route} from 'react-router-dom';

import PageSetPassword from './PageSetPassword';
import PageVerifyEmail from './PageVerifyEmail';
import PageActionResult from './PageActionResult';

import { useLoading } from '../contexts/LoadingContext';
import { useAuth } from '../contexts/AuthContext';

const UrlActionRouter = () => {
    
    const getUrlParams = () => {
        const search = window.location.search;
        return new URLSearchParams(search);
    };

    const validateParams = params => {
        let valid = true;
        if(Array.isArray(params)) {
            params.forEach(param=>{
                if(typeof param !== 'string' || param.length === 0) {
                    valid = false;
                }
            });
        } else {
            valid = typeof params !== 'string' || params.length === 0 && false
        }
        return valid;
    }

    const [operation, setOperation] = useState(null);
    const [codeInfo, setCodeInfo] = useState(null);
    
    const {verifyActionCode} = useAuth();
    const {setIsLoading} = useLoading();
    
    const urlParams = getUrlParams();
    
    const mode =    urlParams.get('mode');
    const oobCode = urlParams.get('oobCode');

    useEffect(async ()=>{
        if(!validateParams([mode, oobCode])) {
            setIsLoading(false);
            return;
        }
        try {
            const oobCodeInfo = await verifyActionCode(oobCode);
            setCodeInfo(oobCodeInfo);
            setOperation(oobCodeInfo.operation);
        } catch(err) {
            console.log(err);
            setIsLoading(false);
        }
    },[]);
    
    return ( 
        <Route path="/action" render={()=>{
            switch(operation) {
                case 'PASSWORD_RESET':
                    return <PageSetPassword codeInfo={codeInfo} urlParams={urlParams} />;
                case 'VERIFY_EMAIL':
                    return <PageVerifyEmail codeInfo={codeInfo} urlParams={urlParams} />;
                default:
                    return <PageActionResult title="Niepoprawny link" alertType="danger" alertMessage="Podany link jest nieprawidłowy" />
            }
        }} />
    );
}
 
export default UrlActionRouter;