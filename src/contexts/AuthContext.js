import React, {useState, useEffect, createContext, useContext} from 'react';
import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

// Firebase setup

const firebaseConfig = {
    apiKey:             process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain:         process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId:          process.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket:      process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId:  process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
    appId:              process.env.REACT_APP_FIREBASE_APPID
};

const app = firebase.initializeApp(firebaseConfig);

const db =          app.firestore();
const auth =        app.auth();
const functions =   app.functions();
const storage =     app.storage();

const useEmulators = false;

if(process.env.NODE_ENV === "development" && useEmulators) {
    db.useEmulator('http://localhost:8081');
    auth.useEmulator('http://localhost:9099',{ disableWarnings: true });
    functions.useEmulator("localhost", 5001);
}

// Context setup

const AuthContext = createContext();

export const useAuth = ()=>{
    return useContext(AuthContext);
}

export default function AuthProvider({children}) {
    
    const [currentUser, setCurrentUser] = useState(null);
    const [loginChecked, setLoginChecked] = useState(false);
    
    useEffect(()=>{
        const unsub = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoginChecked(true);
        });        
        return unsub;
    },[]);

    
    const createUser = async (email, password, firstName, lastName) => {
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            
            const createUserDoc =           functions.httpsCallable('createUserDoc');
            const sendConfirmationLink =    functions.httpsCallable('sendConfirmationLink');
            
            await createUserDoc({firstName, lastName});
            await sendConfirmationLink({firstName, email});
        } catch(error) {
            switch(error.code) {
                case 'auth/email-already-in-use':
                throw new Error('Ten adres e-mail nie mo??e zosta?? u??yty. Wypr??buj inny.');
                case 'auth/invalid-email':
                throw new Error('Adres e-mail jest niepoprawny.');
                case 'auth/weak-password':
                throw new Error('Has??o musi zawiera?? od 8 - 10 znak??w.');
                case 'auth/operation-not-allowed':
                case 'auth/internal-error':
                throw new Error('Us??uga nie jest akutalnie dost??pna. Prosimy spr??bowa?? p????niej.');
                default:
                throw new Error('Nie uda??o si?? utworzy?? konta u??ytkownika.');
            }
        }
    }
    
    const loginUser = async (email, password) => {
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch(error) {
            switch(error.code) {
                case 'auth/invalid-email':
                throw new Error('Adres e-mail jest niepoprawny.');
                case 'auth/user-disabled':
                throw new Error('To konto u??ytkownika zosta??o zablokowane. Skontaktuj si?? z administratorem.');
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                throw new Error('Niepoprawny adres e-mail lub has??o.');
                case 'auth/operation-not-allowed':
                case 'auth/internal-error':
                throw new Error('Us??uga nie jest akutalnie dost??pna. Prosimy spr??bowa?? p????niej.');
                default:
                throw new Error('Nie uda??o si?? zalogowa?? na konto.');
            }
        }
    }

    const logoutUser = async () => {
        return auth.signOut();
    };
    
    const resetPassword = async (email) => {
        try {
            const sendResetLink = functions.httpsCallable('sendResetLink');
            await sendResetLink({email});
        } catch(error) {
            switch(error.details.code) {
                case 'auth/invalid-email':
                    throw new Error('Adres e-mail jest niepoprawny.');
                case 'auth/user-not-found':
                    return;
                case 'auth/operation-not-allowed':
                case 'auth/internal-error':
                    throw new Error('Us??uga nie jest akutalnie dost??pna. Prosimy spr??bowa?? p????niej.');
                default:
                    throw new Error('Nie uda??o si?? zresetowa?? has??a.');
            }
        }
    };

    const verifyActionCode = async oobCode => {
        try {
            const info = await auth.checkActionCode(oobCode);
            return info;
        } catch(err) {
            switch(err.code) {
                case 'auth/expired-action-code':
                    throw new Error('Kod jest nieaktualny.');
                case 'auth/invalid-action-code':
                    throw new Error('Kod jest niepoprawny.');
                case 'auth/user-disabled':
                    throw new Error('Konto u??ytkownika jest wy????czone. Nie mo??na wykona?? operacji');
                case 'auth/user-not-found':
                    throw new Error('Nie znale??li??my konta tego u??ytkownika');
                default:
                    throw new Error('Nie uda??o si?? wykona?? operacji.');
            }
        }
    }

    const setPassword = async (oobCode, password) => {
        try {
            await auth.confirmPasswordReset(oobCode, password);
        } catch(err) {
            switch(err.details.code) {
                case 'auth/invalid-email':
                    throw new Error('Adres e-mail jest niepoprawny.');
                case 'auth/user-not-found':
                    return;
                case 'auth/operation-not-allowed':
                case 'auth/internal-error':
                    throw new Error('Us??uga nie jest akutalnie dost??pna. Prosimy spr??bowa?? p????niej.');
                default:
                    throw new Error('Nie uda??o si?? zresetowa?? has??a.');
            }
        }
    };

    const verifyEmail = async (oobCode) => {
        try {
            await auth.applyActionCode(oobCode);
        } catch(err) {
            throw err;
        }
    };
    
    const value = {
        currentUser,
        setCurrentUser,
        loginUser,
        logoutUser,
        createUser,
        resetPassword,
        setPassword,
        verifyActionCode,
        verifyEmail
    }

    return (
        <AuthContext.Provider value={value}>
            {loginChecked && children}
        </AuthContext.Provider>
    )        
}