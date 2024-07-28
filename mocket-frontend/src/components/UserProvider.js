import React, { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import Alert from "./Alert";

const UserProvider = ({ children }) => {
    const restEndpoint = "http://19.26.28.37:8080/database/user/669c943e6e45b63f43d7add8"
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const callRestApi = async () => {
        return fetch(restEndpoint, {
            method: 'GET', 
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        })
        .then((response) => {if(response.ok) return response.json()})
        .then((responseJson) => {
            console.log(responseJson);
            setUser(responseJson);
        }).catch(error => {
            setError("Failed to fetch from backend.");
            console.log(error);
        })
    }

    useEffect(() => {
        callRestApi();
    }, [])

    return (
        <UserContext.Provider value={{user, refetch: callRestApi}}>
            {error ? (
                <Alert message={error} style={"error"} setError={setError}/>
            ) : (
                <div/>
            )}
            {children}
        </UserContext.Provider>
    );
}

export { UserProvider };