import React from "react";
import { getTotalShares, getAverageCost, 
         getTotalValue, getTotalReturn } from "./Utils";
import "../styling/PositionsSummary.css"

const PositionsSummary = ({ positions, live }) => {
    return(
        <div className="pos-summary">
            <div className="pos-summary-header">Your Position</div>
            <div className="pos-summary-divider"/>
            <div className="pos-summary-labels">
                <div className="pos-summary-labels-left">Shares</div>
                <div className="pos-summary-labels-right">Average Cost</div>
            </div>
            <div className="pos-summary-values">
                <div className="pos-summary-values-left">{getTotalShares(positions)}</div>
                <div className="pos-summary-values-right">${getAverageCost(positions)}</div>
            </div>
            <div className="pos-summary-labels">
                <div className="pos-summary-labels-left">Total Value</div>
                <div className="pos-summary-labels-right">Total Return</div>
            </div>
            <div className="pos-summary-values">
                <div className="pos-summary-values-left">${getTotalValue(positions, live)}</div>
                <div className="pos-summary-values-right">{getTotalReturn(positions, live)}</div>
            </div>
        </div>
    )
}

export default PositionsSummary;