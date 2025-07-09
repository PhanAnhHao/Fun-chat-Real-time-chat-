import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { Spin } from 'antd';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            // console.log(user);
            if (user) {
                const { displayName, email, uid, photoURL } = user;
                setUser({
                    displayName, email, uid, photoURL
                });
                setIsLoading(false);
                navigate('/');
            } else {
                setIsLoading(false);
                navigate('/login');
            }
        });

        // clean function
        return () => {
            unsubscribe();
        }
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ user }}>
            {isLoading ? <Spin /> : children}
        </AuthContext.Provider>
    )
}
