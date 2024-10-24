import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const AuthContext = createContext();

const AuthProvider = ({ children, ...props }) => {
    const [userInfo, setUserInfo] = useState({});
    const values = { userInfo, setUserInfo };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const docRef = query(collection(db, 'users'), where('email', '==', user?.email));
                onSnapshot(docRef, snapshot => {
                    snapshot.forEach(doc => {
                        setUserInfo({ ...user, ...doc.data() })
                    });
                });
            }
            else
                setUserInfo(null);
        });
    }, []);

    return (
        <AuthContext.Provider value={values} {...props}>
            {children}
        </AuthContext.Provider>
    )
}

// hook
function useAuth() {
    const context = useContext(AuthContext);
    if (typeof (context) === 'undefined')
        throw new Error('useAuth must be used within AuthProvider!');
    return context;
}

export { AuthProvider, useAuth };
