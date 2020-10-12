import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [userLog, setUserLog] = useState(false);
    const [userId, setUserId] = useState(false);
    const [ready, setReady] = useState(null);

    const login = useCallback((jwtToken, login, id) => {
        setToken(jwtToken);
        setUserLog(login);
        setUserId(id);

        localStorage.setItem(storageName, JSON.stringify({
            userLog: login, userId: id, token: jwtToken
        }));
    }, [])
    
    const logout = useCallback(() => {
        setToken(null);
        setUserLog(null);
        setUserId(null);
        
        localStorage.removeItem(storageName);
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));

        if (data && data.token) {
            login(data.token, data.userLog, data.userId);
        }
        setReady(true);
    }, [login])

    return { login, logout, token, userLog, userId, ready }
}