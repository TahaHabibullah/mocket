import React, { useState } from "react";
import axios from "axios";
import Alert from "./Alert";
import MocketNavBar from "./MocketNavBar";
import Footer from "./Footer";
import { validEmail } from "./Utils";
import "../styling/Login.css";
import "../styling/Register.css";
import "../styling/App.css";
import "../styling/MocketNavBar.css";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Register = () => {
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonClass, setButtonClass] = useState("");
    const restEndpoint = 'http://localhost:8080/auth/register';
    const googleLoginEndpoint = 'http://localhost:8080/auth/social-login/google';
    const navigator = useNavigate();

    const handleGoogleLogin = async (googleResp) => {
        try {
            const response = await axios.post(googleLoginEndpoint, {
              token: googleResp.credential
            });
            localStorage.setItem('token', response.data.token);
            navigator("/dashboard");
            window.location.reload();
        } catch (error) {
            setError("Failed to login.");
            console.error(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("pass").value;
        const confirm = document.getElementById("confirm").value;
        if(email.length < 1) {
            setAlert("Please fill in the email field.");
        }
        else if(!validEmail(email)) {
            setAlert("Please enter a valid email.")
        }
        else if(password.length < 1) {
            setAlert("Please fill in the password field.");
        }
        else if(password.length < 8 || password.length > 30) {
            setAlert("Password must be 8-30 characters long.");
        }
        else if(password !== confirm) {
            setAlert("Passwords do not match.");
        }
        else {
            setIsLoading(true);
            setAlert(null);
            const body = {
                "email": email,
                "password": password,
                "roles": ["user"]
            }
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
            <div className="mocket-register">
                <div className="mocket-register-header">Register New Account</div>
                <form onSubmit={handleSubmit}>
                    <div className="mocket-register-input-box">
                        <input id="email" placeholder="Email" className="mocket-register-input"/>
                    </div>
                    <div className="mocket-register-input-box">
                        <input id="pass" type="password" placeholder="Password" className="mocket-register-input"/>
                    </div>
                    <div className="mocket-register-input-box">
                        <input id="confirm" type="password" placeholder="Confirm Password" className="mocket-register-input"/>
                    </div>
                    <button type="submit" className={`mocket-login-button ${buttonClass}`} disabled={isLoading}>
                        {isLoading ? (
                            <div className="login-loading-spinner"/>
                        ) : (
                            'Register'
                        )}
                    </button>
                </form>
                
                <div className="mocket-register-existing">
                    <div>Already have an account?</div>
                    <div className="mocket-register-existing-button" onClick={handleRedirect}>Login Here</div>
                </div>
                <div className="mocket-login-or">
                    <div className="mocket-login-or-divider"/>
                    <div className="mocket-login-or-header">OR</div>
                    <div className="mocket-login-or-divider"/>
                </div>
                <div className="mocket-login-social">
                    <GoogleOAuthProvider clientId={CLIENT_ID}>
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => {setError("Failed to Login.")}}
                        />
                    </GoogleOAuthProvider>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Register;