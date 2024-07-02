import React from "react";
import "../styling/TradeActions.css"

const TradeActions = ({ positions, live }) => {
    var buyOpen = false;
    var sellOpen = false;
    var acc = document.getElementsByClassName("accordion");

    const handleToggle = (index) => {
        var panel = acc[index].nextElementSibling;
        acc[index].classList.toggle("active");
        if(index === 0) {
            if(buyOpen) {
                panel.style.maxHeight = null;
                panel.style.borderWidth = "0px";
                acc[1].style.display = "inline-block";
                acc[0].style.width = "100%"
            }
            else {
                acc[0].style.width = "240%"
                acc[1].style.display = "none";
                panel.style.width = "240%";
                panel.style.maxHeight = panel.scrollHeight + "px";
                panel.style.borderWidth = "2px";
            }
            buyOpen = !buyOpen
        }
        else {
            if(sellOpen) {
                panel.style.maxHeight = null;
                panel.style.borderWidth = "0px";
            }
            else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                panel.style.borderWidth = "2px";
            }
            sellOpen = !sellOpen;
        }
    }

    return (
        <div>
            {positions ? (
                <div className="trade-actions">
                    <div className="trade-actions-buy">
                        <button className="accordion" onClick={() => {handleToggle(0)}}>BUY</button>
                        <div className="panel">
                            <p>Testing</p>
                        </div>
                    </div>
                    <div className="trade-actions-sell">
                        <button className="accordion" onClick={() => {handleToggle(1)}}>SELL</button>
                        <div className="panel">
                            <p>Testing</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div/>
            )}
        </div>
    )
}

export default TradeActions;