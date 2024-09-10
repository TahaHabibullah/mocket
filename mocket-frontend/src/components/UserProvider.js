import React, { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import Alert from "./Alert";

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const UserProvider = ({ children }) => {
    const restEndpoint = 'http://localhost:8080/database/user/';
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const id = localStorage.getItem('id');
    const callRestApi = async () => {
        axios.get(restEndpoint + id)
        .then((response) => {
            setUser(response.data);
        }).catch(error => {
            setError("Failed to fetch from backend.");
            console.log(error);
        })
    }

    useEffect(() => {
        if(id) {
            callRestApi();
        }
    }, [])

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
}

export { UserProvider };