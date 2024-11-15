import React from "react";
import "../styling/Footer.css";

const ppUrl = process.env.REACT_APP_PRIVACY_POLICY;

const Footer = () => {
    return (
        <footer className="mocket-footer">
            <div className="mocket-footer-items">
                <nobr>Copyright &copy; 2024 | Mocket |&nbsp;</nobr>
                <a className="mocket-footer-link" href={ppUrl} target="_blank">
                    Privacy Policy
                </a>
            </div>
        </footer>
    );
};

export default Footer;