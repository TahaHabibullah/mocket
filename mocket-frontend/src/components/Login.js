import React, { useState } from "react";
import axios from "axios";
import Alert from "./Alert";
import MocketNavBar from "./MocketNavBar";
import "../styling/Login.css";
import "../styling/App.css";
import "../styling/MocketNavBar.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const restEndpoint = 'http://localhost:8080/auth/login';
    const navigator = useNavigate();

    const handleClick = () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("pass").value;
        if(email.length < 1) {
            setAlert("Please fill in email field.");
        }
        else if(password.length < 1) {
            setAlert("Please fill in password field.");
        }
        else {
            setAlert(null);
            const body = {
                "email": email,
                "password": password
            }
            axios.post(restEndpoint, body)
            .then((response) => {
                console.log(response.data);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('id', response.data.id);
                navigator("/dashboard");
                window.location.reload();
            }).catch(error => {
                setError("Failed to login.");
                console.log(error);
            })
        }
    }

    const handleRedirect = () => {
        navigator("/register");
    }

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
            <MocketNavBar style="login"/>
            <div className="mocket-login">
                <div className="mocket-login-header">Log into Mocket</div>
                <div className="mocket-login-input-box">
                    <input id="email" placeholder="Email" className="mocket-login-input"/>
                </div>
                <div className="mocket-login-input-box">
                    <input id="pass" type="password" placeholder="Password" className="mocket-login-input"/>
                </div>
                <button className="mocket-login-button" onClick={handleClick}>Login</button>
                <div className="mocket-login-newuser">
                    <div>Don't have an account?</div>
                    <div className="mocket-login-newuser-button" onClick={handleRedirect}>Register Here</div>
                </div>
            </div>
        </div>
    )
}

export default Login;