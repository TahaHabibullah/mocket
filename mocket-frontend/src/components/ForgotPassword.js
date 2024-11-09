import React, { useState } from "react";
import axios from "axios";
import Alert from "./Alert";
import MocketNavBar from "./MocketNavBar";
import { validEmail } from "./Utils";
import "../styling/ForgotPassword.css";
import "../styling/App.css";
import "../styling/MocketNavBar.css";
import "../styling/Login.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonClass, setButtonClass] = useState("");
    const navigator = useNavigate();
    const restEndpoint = 'http://localhost:8080/auth/forgot-password';

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        if(email.length < 1) {
            setAlert("Please fill in the email field.");
        }
        else if(!validEmail(email)) {
            setAlert("Please enter a valid email.")
        }
        else {
            setIsLoading(true);
            setAlert(null);
            const body = { email };
            axios.post(restEndpoint, body)
            .then((response) => {
                setSuccess(response.data);
                setButtonClass("success");
                setTimeout(() => setButtonClass(""), 200);
            }).catch(error => {
                const message = error.response.data;
                setError(message);
                setButtonClass("error");
                setTimeout(() => setButtonClass(""), 200);
            }).finally(() => {
                setIsLoading(false);
            });
        }
    };

    const handleRedirect = () => {
        navigator("/login");
    };

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
            <div className="mocket-forgot-password">
                <div className="mocket-forgot-header">Forgot Password?</div>
                <form onSubmit={handleSubmit}>
                    <div className="mocket-forgot-input-box">
                        <input id="email" placeholder="Enter your email here" className="mocket-forgot-input"/>
                    </div>
                    <button type="submit" className={`mocket-login-button ${buttonClass}`} disabled={isLoading}>
                        {isLoading ? (
                            <div className="login-loading-spinner"/>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </form>
                <div className="mocket-forgot-remembered">
                    <div>Remembered your password?</div>
                    <div className="mocket-forgot-remembered-button" onClick={handleRedirect}>Login here</div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;