import React, { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import Alert from "./Alert";
import { getUserId } from "./Utils";

const UserProvider = ({ children }) => {
    const restEndpoint = 'http://localhost:8080/database/user/';
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const callRestApi = async () => {
        axios.get(restEndpoint + getUserId(token))
        .then((response) => {
            setUser(response.data);
        }).catch(error => {
            setError("Failed to fetch from backend.");
            console.log(error);
        });
    };

    useEffect(() => {
        if(token) {
            callRestApi();
        }
    }, []);

    return (
        <UserContext.Provider value={{user, refetch: callRestApi}}>
            {error ? (
                <Alert message={error} style={"error"} setAlert={setError}/>
            ) : (
                <div/>
            )}
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider };