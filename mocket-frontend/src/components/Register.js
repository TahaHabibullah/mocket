import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Alert from "./Alert";
import { validEmail } from "./Utils";
import "../styling/Register.css";
import "../styling/App.css";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const restEndpoint = 'http://localhost:8080/auth/register';
    const loginEndpoint = 'http://localhost:8080/auth/login';
    const { user, setToken, setUser } = useContext(UserContext);
    const navigator = useNavigate();

    const handleClick = () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("pass").value;
        const confirm = document.getElementById("confirm").value;
        if(email.length < 1) {
            setAlert("Please fill in email field.");
        }
        else if(!validEmail(email)) {
            setAlert("Please enter a valid email.")
        }
        else if(password.length < 1) {
            setAlert("Please fill in password field.");
        }
        else if(password !== confirm) {
            setAlert("Passwords do not match.")
        }
        else {
            setAlert(null);
            const body = {
                "email": email,
                "password": password,
                "roles": ["user"]
            }
            axios.post(restEndpoint, body)
            .then((response) => {
                console.log(response.data);
                const loginBody = {
                    "email": email,
                    "password": password
                }
                axios.post(loginEndpoint, loginBody)
                .then((response) => {
                    console.log(response.data);
                    setToken(response.data.token);
                    setUser(response.data);
                }).catch(error => {
                    setError("Failed to login.");
                    console.log(error);
                })
            }).catch(error => {
                setError("Failed to register.");
                console.log(error);
            })
        }
    }

    const handleRedirect = () => {
        navigator("/login");
    }

    useEffect(() => {
        if(user) {
            navigator("/dashboard");
        }
    }, [user]);

    return (
        <div className="App">
            {error ? (
                <Alert message={error} style={"error"} setAlert={setError}/>
            ) : (
                <div/>
            )}
            {alert ? (
                <Alert message={alert} style={"warning"} setAlert={setAlert}/>
            ) : (
                <div/>
            )}
            <div className="mocket-register">
                <div className="mocket-register-header">Register New Account</div>
                <div className="mocket-register-input-box">
                    <input id="email" placeholder="Email" className="mocket-register-input"/>
                </div>
                <div className="mocket-register-input-box">
                    <input id="pass" type="password" placeholder="Password" className="mocket-register-input"/>
                </div>
                <div className="mocket-register-input-box">
                    <input id="confirm" type="password" placeholder="Confirm Password" className="mocket-register-input"/>
                </div>
                <button className="mocket-register-button" onClick={handleClick}>Register</button>
                <div className="mocket-register-existing">
                    <div>Already have an account?</div>
                    <div className="mocket-register-existing-button" onClick={handleRedirect}>Login Here</div>
                </div>
                
            </div>
        </div>
    )
}

export default Register;