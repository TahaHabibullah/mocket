import React from "react";
import "./QuoteDataTile.css"

const QuoteDataTile = ({ title, data }) => {
    return (
        <div className="quote-tile">
            <div className="quote-tile-title">{title}</div>
            <div className="quote-tile-data">{data}</div>
        </div>
    )
}

export default QuoteDataTile;