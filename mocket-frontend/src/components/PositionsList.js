import React, { useContext } from "react";
import PositionsTile from "./PositionsTile";
import "../styling/PositionsList.css";
import { UserContext } from "./UserContext";
import { getCombinedPositions, getOpenPositions, getSymQuote } from "./Utils";

const PositionsList = ({ quoteList }) => {
    const positions = getCombinedPositions(getOpenPositions(useContext(UserContext).positions));

    const renderList = () => {
        const list = [];
        positions.forEach((value, key) => {
            list.push(
                <div key={key} className="positions-list-item">
                    <PositionsTile data={value} quoteData={getSymQuote(quoteList, key)}/>
                </div>
            );
        })
        return list;
    }
    return (
        <div className="positions-list">
            <div className="positions-list-header">Your Positions</div>
            <div className="positions-list-divider"/>
            {renderList()}
        </div>
        
    )
    
}

export default PositionsList;