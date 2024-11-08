import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styling/QuoteHeader.css"

const QuoteHeader = ({ name, live, data, tooltipActive }) => {
    const { symbol } = useParams();
    const [prevLive, setPrevLive] = useState(live);
    const [prevSymbol, setPrevSymbol] = useState(symbol);

    useEffect(() => {
        if(prevSymbol === symbol) {
            if(!tooltipActive) {
                const price = document.getElementById("price");
                const animation = live > prevLive ? "greenflash" : (prevLive > live ? "redflash" : "");

                if(animation !== "") {
                    price.classList.add(animation)
                    setTimeout(() => {
                        price.classList.remove(animation);
                    }, 900);
                }
                setPrevLive(live);
            }
        }
        else {
            setPrevSymbol(symbol);
            setPrevLive(live);
        }
    }, [live]);

    return (
        <div className="quote-header">
            <div className="quote-header-stock">
                <div>
                    <div className="quote-header-stock-name">{name}</div>
                    <div className="quote-header-stock-symbol">{data.symbol}</div>
                </div>
            </div>
            <div id="price" className="quote-header-price">${live}</div>
        </div>
    );
};

export default QuoteHeader;