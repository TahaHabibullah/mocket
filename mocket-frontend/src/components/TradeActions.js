import React from "react";
import { useMediaQuery } from 'react-responsive';
import Buy from "./Buy";
import Sell from "./Sell";
import "../styling/TradeActions.css"

const TradeActions = ({ positions, live }) => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1320 });
    const isMobile = useMediaQuery({ maxWidth: 767 });
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
                acc[0].style.width = "100%";
                panel.style.width = "100%";
            }
            else {
                acc[0].style.zIndex = 1;
                acc[1].style.zIndex = 0;
                if(isMobile) {
                    acc[0].style.width = "225%";
                    panel.style.width = "225%";
                }
                else if(isTablet) {
                    acc[0].style.width = `${(80.0/35.0) * 100}%`;
                    panel.style.width = `${(80.0/35.0) * 100}%`;
                }
                else {
                    acc[0].style.width = "240%";
                    panel.style.width = "240%";
                }
                panel.style.maxHeight = panel.scrollHeight + "px";
                panel.style.borderWidth = "1px";
            }
            buyOpen = !buyOpen
        }
        else {
            if(sellOpen) {
                panel.style.maxHeight = null;
                panel.style.borderWidth = "0px";
                acc[1].style.width = "100%";
                panel.style.width = "100%";
            }
            else {
                acc[1].style.zIndex = 1;
                acc[0].style.zIndex = 0;
                if(isMobile) {
                    acc[1].style.width = "225%";
                    panel.style.width = "225%";
                }
                else if(isTablet) {
                    acc[1].style.width = `${(80.0/35.0) * 100}%`;
                    panel.style.width = `${(80.0/35.0) * 100}%`;
                }
                else {
                    acc[1].style.width = "240%";
                    panel.style.width = "240%";
                }
                panel.style.maxHeight = panel.scrollHeight + "px";
                panel.style.borderWidth = "1px";
            }
            sellOpen = !sellOpen;
        }
    }

    const handleToggleLone = () => {
        var panel = acc[0].nextElementSibling;
        acc[0].classList.toggle("active");
        if(buyOpen) {
            panel.style.maxHeight = null;
            panel.style.borderWidth = "0px";
        }
        else {
            panel.style.maxHeight = panel.scrollHeight + "px";
            panel.style.borderWidth = "1px";
        }
        buyOpen = !buyOpen;
    }

    return (
        <div>
            {positions ? (
                <div className="trade-actions">
                    <div className="trade-actions-buy">
                        <button className="accordion left" onClick={() => {handleToggle(0)}}>BUY</button>
                        <div className="panel left">
                            <Buy/>
                        </div>
                    </div>
                    <div className="trade-actions-sell">
                        <button className="accordion right" onClick={() => {handleToggle(1)}}>SELL</button>
                        <div className="panel right">
                            <Sell/>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="trade-actions-buy-lone">
                    <button className="accordion" onClick={() => {handleToggleLone()}}>BUY</button>
                    <div className="panel">
                        <Buy/>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TradeActions;