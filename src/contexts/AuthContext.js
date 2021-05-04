import React, {useState, useEffect, createContext, useContext} from 'react';
import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

// Firebase setup

const firebaseConfig = {
    // YOUR FIREBASE CONFIG GOES HERE
  };

const app = firebase.initializeApp(firebaseConfig);

const db =          app.firestore();
const auth =        app.auth();
const functions =   app.functions();
const storage =     app.storage();

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
                throw new Error('Ten adres e-mail nie może zostać użyty. Wypróbuj inny.');
                case 'auth/invalid-email':
                throw new Error('Adres e-mail jest niepoprawny.');
                case 'auth/weak-password':
                throw new Error('Hasło musi zawierać od 8 - 10 znaków.');
                case 'auth/operation-not-allowed':
                case 'auth/internal-error':
                throw new Error('Usługa nie jest akutalnie dostępna. Prosimy spróbować później.');
                default:
                throw new Error('Nie udało się utworzyć konta użytkownika.');
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
                throw new Error('To konto użytkownika zostało zablokowane. Skontaktuj się z administratorem.');
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                throw new Error('Niepoprawny adres e-mail lub hasło.');
                case 'auth/operation-not-allowed':
                case 'auth/internal-error':
                throw new Error('Usługa nie jest akutalnie dostępna. Prosimy spróbować później.');
                default:
                throw new Error('Nie udało się zalogować na konto.');
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
                    throw new Error('Usługa nie jest akutalnie dostępna. Prosimy spróbować później.');
                default:
                    throw new Error('Nie udało się zresetować hasła.');
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
                    throw new Error('Konto użytkownika jest wyłączone. Nie można wykonać operacji');
                case 'auth/user-not-found':
                    throw new Error('Nie znaleźliśmy konta tego użytkownika');
                default:
                    throw new Error('Nie udało się wykonać operacji.');
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
                    throw new Error('Usługa nie jest akutalnie dostępna. Prosimy spróbować później.');
                default:
                    throw new Error('Nie udało się zresetować hasła.');
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