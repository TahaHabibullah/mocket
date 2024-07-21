import React, { useState, useEffect } from "react";
import { UserContext } from "./UserContext";

const UserProvider = ({ children }) => {
    const restEndpoint = "http://19.26.28.37:8080/database/user/6688d97bc948341d3dee4115"
    const [user, setUser] = useState(null);
    const callRestApi = async () => {
        return fetch(restEndpoint, {
            method: 'GET', 
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            setUser(responseJson);
        })
    }

    useEffect(() => {
        callRestApi();
    }, [])

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}

export { UserProvider };