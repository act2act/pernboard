import config from '../config';
import { useContext, useState, useEffect, createContext } from 'react';

const UserContext = createContext();
const apiUrl = config.apiUrl;

function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`${apiUrl}/profile`, {
                method: 'GET',
                credentials: 'include'
            })

            const userData = await response.json();
            setUser(userData);
            setLoading(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <UserContext.Provider value={{ user, loading, error }}>
            { children }
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext);
export default UserProvider;