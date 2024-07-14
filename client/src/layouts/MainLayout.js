import React, {createContext, useContext, useState, useEffect} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UserContext = createContext();

function MainLayout({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, [])

    const fetchUserProfile = async () => {
        try {
            const response = await fetch('http://localhost:4000/profile', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <UserContext.Provider value={{user}}>
            <Header />
            <main>{children}</main>
            <Footer />
        </UserContext.Provider>
    )
};

export const useUser = () => useContext(UserContext);
export default MainLayout;