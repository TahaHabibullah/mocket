import React, { useEffect, useState } from "react";
import axios from "axios";
import Alert from "./Alert";
import MocketNavBar from "./MocketNavBar";
import "../styling/Login.css";
import "../styling/App.css";
import "../styling/MocketNavBar.css";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const MAX_ATTEMPTS = process.env.REACT_APP_MAX_ATTEMPTS;
const LOCK_DURATION = process.env.REACT_APP_LOCK_DURATION;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [success, setSuccess] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [lockTime, setLockTime] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonClass, setButtonClass] = useState("");
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const restEndpoint = '/auth/login';
    const googleLoginEndpoint = '/auth/social-login/google';
    const verificationEndpoint = '/auth/verify-email';
    const navigator = useNavigate();

    const handleGoogleLogin = async (googleResp) => {
        try {
            const response = await axios.post(googleLoginEndpoint, {
              token: googleResp.credential
            });
            localStorage.setItem('token', response.data.token);
            navigator("/dashboard");
        } catch (error) {
            setError("Failed to login.");
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isLocked()) {
            setButtonClass("error");
            setTimeout(() => setButtonClass(""), 200);
            setError("Login locked. Try again later.");
            return;
        }
        const email = document.getElementById("email").value;
        const password = document.getElementById("pass").value;
        if(email.length < 1) {
            setAlert("Please fill in the email field.");
        }
        else if(password.length < 1) {
            setAlert("Please fill in the password field.");
        }
        else {
            setIsLoading(true);
            setAlert(null);
            const body = {
                "email": email,
                "password": password
            }
            axios.post(restEndpoint, body)
            .then((response) => {
                localStorage.setItem('token', response.data.token);
                navigator("/dashboard");
            }).catch(error => {
                incrementAttempts();
                const message = error.response.data;
                setError(message);
                setButtonClass("error");
                setTimeout(() => setButtonClass(""), 200);
            }).finally(() => {
                setIsLoading(false);
            });
        }
    };

    const handleVerification = () => {
        const body = { token };
        axios.put(verificationEndpoint, body)
            .then((response) => {
                setSuccess(response.data);
            }).catch(error => {
                const message = error.response.data;
                setError(message);
            });
    };

    const isLocked = () => {
        if(attempts >= MAX_ATTEMPTS) {
            if(lockTime) {
                const curr = new Date().getTime();
                const start = new Date(lockTime).getTime();
                if(curr - start <= LOCK_DURATION) {
                    return true;
                }
                else {
                    resetAttempts();
                }
            }
        }
        return false;
    };

    const incrementAttempts = () => {
        const att = attempts + 1;
        setAttempts(att);
        localStorage.setItem('loginAttempts', att);

        if(att >= MAX_ATTEMPTS) {
            const curr = new Date();
            setLockTime(curr);
            localStorage.setItem('lockTime', curr);
        }
    };

    const resetAttempts = () => {
        setAttempts(0);
        setLockTime(null);
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockTime');
    };

    const goToRegister = () => {
        navigator("/register");
    };

    const goToForgotPass = () => {
        navigator("/forgot-password");
    };

    useEffect(() => {
        const savedAttempts = localStorage.getItem('loginAttempts');
        const savedTime = localStorage.getItem('lockTime');

        if(savedAttempts) {
            setAttempts(savedAttempts);
        }
        if(savedTime) {
            setLockTime(savedTime);
        }

        if(token) {
            handleVerification();
        }
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
            <div className="mocket-login">
                <div className="mocket-login-header">Log into Mocket</div>
                <form onSubmit={handleSubmit}>
                    <div className="mocket-login-input-box">
                        <input id="email" placeholder="Email" className="mocket-login-input"/>
                    </div>
                    <div className="mocket-login-input-box">
                        <input id="pass" type="password" placeholder="Password" className="mocket-login-input"/>
                    </div>
                    <div className="mocket-login-forgot-button" onClick={goToForgotPass}>Forgot your password?</div>
                    <button type="submit" className={`mocket-login-button ${buttonClass}`} disabled={isLoading}>
                        {isLoading ? (
                            <div className="login-loading-spinner"/>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
                <div className="mocket-login-newuser">
                    <div>Don't have an account?</div>
                    <div className="mocket-login-newuser-button" onClick={goToRegister}>Register Here</div>
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
        </div>
    );
};

export default Login;