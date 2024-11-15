import React from "react";
import PositionsTile from "./PositionsTile";
import "../styling/PositionsList.css";
import { getSymQuote } from "./Utils";

const PositionsList = ({ positions, quoteList }) => {
    const renderList = () => {
        const list = [];
        positions.forEach((value, key) => {
            list.push(
                <div key={key} className="positions-list-item">
                    <PositionsTile data={value} quoteData={getSymQuote(quoteList, key)}/>
                </div>
            );
        });
        return list;
    };

    return (
        <div className="positions-list">
            <div className="positions-list-header">Your Positions</div>
            <div className="positions-list-divider"/>
            {renderList()}
        </div>
        
    );
};

export default PositionsList;