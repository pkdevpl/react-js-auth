import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';

const PrivateRoute = ({component: Component, redirect, ...rest}) => {
    const {currentUser} = useAuth();
    
    return ( 
        <Route {...rest} render={props=>{
            if(currentUser) {
                return <Component {...props} />;
            } else {
                return <Redirect to={redirect} />;
            }
        }} />
     );
}
 
export default PrivateRoute;