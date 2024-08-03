import React from "react";
import "../styling/QuoteHeader.css"

const QuoteHeader = ({ live, data }) => {
    return (
        <div className="quote-header">
            <div className="quote-header-stock">
                <div>
                    <div className="quote-header-stock-name">{data.name}</div>
                    <div className="quote-header-stock-symbol">{data.symbol}</div>
                </div>
            </div>
            <div data-testid="price" className="quote-header-price">${live}</div>
        </div>
    )
}

export default QuoteHeader;