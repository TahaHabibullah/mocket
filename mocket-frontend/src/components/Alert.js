import React from "react";
import "../styling/Alert.css";

const Alert = ({ message, style, setAlert }) => {
    const handleClick = () => {
        setAlert(null);
    }

    const getType = () => {
        if(style === "error") {
            return "Error:"
        }
        else if(style === "warning") {
            return "Notice:"
        }
        else if(style === "success") {
            return "Success:"
        }
    }

    return (
        <div id={0} className="alert">
            <div className={"alert-" + style}>
                <div className="alert-message">
                    {getType()} {message}
                </div>
                <span className="alert-dismiss" onClick={handleClick}>&times;</span>
            </div>
        </div>
    )
}

export default Alert;