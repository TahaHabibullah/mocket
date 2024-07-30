import React, { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import Alert from "./Alert";

const UserProvider = ({ children }) => {
    const restEndpoint = "http://19.26.28.37:8080/database/user/66a8957e631f435b8dcc2d43"
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const callRestApi = async () => {
        axios.get(restEndpoint)
        .then((response) => {
            console.log(response.data);
            setUser(response.data);
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