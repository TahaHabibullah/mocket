import React from "react";
import PositionsTile from "./PositionsTile";
import "../styling/PositionsList.css";

const PositionsList = ({ data }) => {
    return (
        <div className="positions-list">
            {data.map((position, index) => (
                <div key={index} className="positions-list-item">
                    <PositionsTile data={position}/>
                </div>
            ))}
        </div>
    )
    
}

export default PositionsList;