import React from "react";
import "./QuoteHeader.css"

const QuoteHeader = ({ live, data }) => {
    return (
        <div className="quote-header">
            <div className="quote-header-stock">
                <div>
                    <div className="quote-header-stock-name">{data.name}</div>
                    <div className="quote-header-stock-symbol">{data.symbol}</div>
                </div>
            </div>
            <div className="quote-header-price">${live}</div>
        </div>
    )
}

export default QuoteHeader;