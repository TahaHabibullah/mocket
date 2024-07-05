import React from "react";
import QuoteDataTile from "./QuoteDataTile";
import { parsePrice, parseVolume } from "./Utils";
import "../styling/QuoteDataGrid.css";

const QuoteDataGrid = ({ data }) => {
    return (
        <div className="quote-data-grid">
            <div className="quote-data-grid-header">Statistics</div>
            <div className="quote-data-grid-divider"/>
            <div className="quote-data-grid-item">
                <div className="quote-data-grid-left">
                    <QuoteDataTile title="Volume" data={parseVolume(data.volume)}/>
                </div>
                <div className="quote-data-grid-vdivider"/>
                <div className="quote-data-grid-right">
                    <QuoteDataTile title="Average Volume" data={parseVolume(data.average_volume)}/>
                </div>
            </div>
            <div className="quote-data-grid-item">
                <div className="quote-data-grid-left">
                    <QuoteDataTile title="Today's High" data={parsePrice(data.high)}/>
                </div>
                <div className="quote-data-grid-vdivider"/>
                <div className="quote-data-grid-right">
                    <QuoteDataTile title="Today's Low" data={parsePrice(data.low)}/>
                </div>
            </div>
            <div className="quote-data-grid-item">
                <div className="quote-data-grid-left">
                    <QuoteDataTile title="Today's Open" data={parsePrice(data.open)}/>
                </div>
                <div className="quote-data-grid-vdivider"/>
                <div className="quote-data-grid-right">
                    <QuoteDataTile title="Today's Close" data={parsePrice(data.close)}/>
                </div>
            </div>
            <div className="quote-data-grid-item">
                <div className="quote-data-grid-left">
                    <QuoteDataTile title="52-Week High" data={parsePrice(data.fifty_two_week.high)}/>
                </div>
                <div className="quote-data-grid-vdivider"/>
                <div className="quote-data-grid-right">
                    <QuoteDataTile title="52-Week Low" data={parsePrice(data.fifty_two_week.low)}/>
                </div>
            </div>
        </div>
    )
}

export default QuoteDataGrid;