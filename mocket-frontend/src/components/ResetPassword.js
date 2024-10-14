import React, { useEffect, useState } from "react";
import axios from "axios";
import Alert from "./Alert";
import MocketNavBar from "./MocketNavBar";
import Footer from "./Footer";
import "../styling/ResetPassword.css";
import "../styling/App.css";
import "../styling/MocketNavBar.css";
import "../styling/Login.css";

const ResetPassword = () => {
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [success, setSuccess] = useState(null);
    const [valid, setValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonClass, setButtonClass] = useState("");
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const checkEndpoint = 'http://localhost:8080/auth/check-token';
    const restEndpoint = 'http://localhost:8080/auth/reset-password';

    const callRestApi = () => {
        const body = { token }
        axios.post(checkEndpoint, body)
        .then((response) => {
            setValid(true);
        }).catch(error => {
            const message = error.response.data;
            setError(message);
            console.log(message);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const password = document.getElementById("pass").value;
        const confirm = document.getElementById("confirm").value;
        if(password.length < 1) {
            setAlert("Please fill in the password field.");
        }
        else if(password.length < 8 || password.length > 30) {
            setAlert("Password must be 8-30 characters long.");
        }
        else if(password !== confirm) {
            setAlert("Passwords do not match.")
        }
        else {
            setIsLoading(true);
            setAlert(null);
            const body = {
                "token": token,
                "password": password
            }
            axios.put(restEndpoint, body)
            .then((response) => {
                setSuccess(response.data);
                setButtonClass("success");
                setTimeout(() => setButtonClass(""), 200);
            }).catch(error => {
                const message = error.response.data;
                setError(message);
                console.log(message);
                setButtonClass("error");
                setTimeout(() => setButtonClass(""), 200);
            }).finally(() => {
                setIsLoading(false);
            });
        }
    };

    useEffect(() => {
        callRestApi();
    }, []);

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
            {success ? (
                <Alert message={success} style={"success"} setAlert={setSuccess}/>
            ) : (
                <div/>
            )}
            <MocketNavBar style="login"/>
            {valid ? (
                <div className="mocket-reset-password">
                    <div className="mocket-reset-header">Reset Password</div>
                    <form onSubmit={handleSubmit}>
                        <div className="mocket-reset-input-box">
                            <input id="pass" type="password" placeholder="New Password" className="mocket-reset-input"/>
                        </div>
                        <div className="mocket-reset-input-box">
                            <input id="confirm" type="password" placeholder="Confirm Password" className="mocket-reset-input"/>
                        </div>
                        <button type="submit" className={`mocket-reset-button ${buttonClass}`} disabled={isLoading}>
                            {isLoading ? (
                                <div className="login-loading-spinner"/>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                <div/>
            )}
            <Footer/>
        </div>
    );
};

export default ResetPassword;