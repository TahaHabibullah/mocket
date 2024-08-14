import React from "react";
import OrderHistoryTile from "./OrderHistoryTile.js";
import "../styling/OrderHistoryList.css"

const OrderHistoryList = ({ hist }) => {
    return (
        <div className="order-history-list">
            {
            hist.map((data, index) => {
                return (
                    <div key={index}>
                        <OrderHistoryTile data={data}/>
                        {index < hist.length-1 ? (
                            <div className="order-history-list-divider"/>
                        ) : (
                            <div/>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default OrderHistoryList;