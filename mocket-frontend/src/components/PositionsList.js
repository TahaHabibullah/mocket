import React, { useContext } from "react";
import PositionsTile from "./PositionsTile";
import "../styling/PositionsList.css";
import { UserContext } from "./UserContext";
import { getOpenPositions } from "./Utils";

const PositionsList = ({ quoteList }) => {
    const positions = getOpenPositions(useContext(UserContext).positions);
    return (
        <div className="positions-list">
            {positions.map((position, index) => (
                <div key={index} className="positions-list-item">
                    <PositionsTile data={position} quoteData={quoteList[index]}/>
                </div>
            ))}
        </div>
    )
    
}

export default PositionsList;