import React, { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import Alert from "./Alert";

const UserProvider = ({ children }) => {
    const restEndpoint = 'http://localhost:8080/database/user/';
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const callRestApi = async () => {
        const config = { 
            headers: { Authorization: `Bearer ${token}` }
        }
        axios.get(restEndpoint + user.id, config)
        .then((response) => {
            setUser(response.data);
        }).catch(error => {
            setError("Failed to fetch from backend.");
            console.log(error);
        })
    }

    return (
        <UserContext.Provider value={{user, token, setToken, setToken, setUser: setUser, refetch: callRestApi}}>
            {error ? (
                <Alert message={error} style={"error"} setAlert={setError}/>
            ) : (
                <div/>
            )}
            {children}
        </UserContext.Provider>
    );
}

export { UserProvider };