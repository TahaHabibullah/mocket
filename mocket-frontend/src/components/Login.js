import React, { useEffect, useState } from "react";
import axios from "axios";
import Alert from "./Alert";
import MocketNavBar from "./MocketNavBar";
import "../styling/Login.css";
import "../styling/App.css";
import "../styling/MocketNavBar.css";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [success, setSuccess] = useState(null);
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const restEndpoint = 'http://localhost:8080/auth/login';
    const googleLoginEndpoint = 'http://localhost:8080/auth/social-login/google';
    const verificationEndpoint = 'http://localhost:8080/auth/verify-email';
    const navigator = useNavigate();

    const handleGoogleLogin = async (googleResp) => {
        try {
            const response = await axios.post(googleLoginEndpoint, {
              token: googleResp.credential
            });
            console.log(response.data)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('id', response.data.id);
            navigator("/dashboard");
            window.location.reload();
          } catch (error) {
            setError("Failed to login.");
            console.error(error);
          }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("pass").value;
        if(email.length < 1) {
            setAlert("Please fill in the email field.");
        }
        else if(password.length < 1) {
            setAlert("Please fill in the password field.");
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
                navigator("/dashboard");
                window.location.reload();
            }).catch(error => {
                const message = error.response.data;
                setError(message);
                console.log(message);
            })
        }
    }

    const handleVerification = () => {
        const body = { token };
        axios.put(verificationEndpoint, body)
            .then((response) => {
                setSuccess(response.data);
            }).catch(error => {
                const message = error.response.data;
                setError(message);
                console.log(message);
            })
    }

    const goToRegister = () => {
        navigator("/register");
    }

    const goToForgotPass = () => {
        navigator("/forgot-password");
    }

    useEffect(() => {
        if(token) {
            handleVerification();
        }
    }, [])

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
                    <button type="submit" className="mocket-login-button">Login</button>
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
                    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => {setError("Failed to Login.")}}
                        />
                    </GoogleOAuthProvider>
                </div>
            </div>
        </div>
    )
}

export default Login;