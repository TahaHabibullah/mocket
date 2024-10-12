import React from "react";
import "../styling/OrderHistoryTile.css"
import { getPriceDiff, parsePrice, parseLabel } from "./Utils";

const OrderHistoryTile = ({ data }) => {
    return (
        <div>
            {data.sell ? (
            <div className="order-history-tile">
                <div className="order-history-tile-header">
                    <div className="order-history-tile-header-left">SELL</div>
                    <div className="order-history-tile-header-right">{data.symbol}</div>
                </div>
                <div className="order-history-tile-labels">
                    <div className="order-history-tile-label">Quantity</div>
                    <div className="order-history-tile-label">Sell Price</div>
                    <div className="order-history-tile-label">Total Value</div>
                </div>
                <div className="order-history-tile-values">
                    <div className="order-history-tile-value">{data.quantity}</div>
                    <div className="order-history-tile-value">${parsePrice(data.sell)}</div>
                    <div className="order-history-tile-value">${parsePrice(data.quantity * data.sell)}</div>
                </div>
                <div className="order-history-tile-labels">
                    <div className="order-history-tile-label">Date</div>
                    <div className="order-history-tile-label">Buy Price</div>
                    <div className="order-history-tile-label">Total Return</div>
                </div>
                <div className="order-history-tile-values">
                    <div className="order-history-tile-value">{parseLabel(data.timestamp)}</div>
                    <div className="order-history-tile-value">${parsePrice(data.buy)}</div>
                    <div className="order-history-tile-value">{getPriceDiff(data.quantity * data.buy, 
                                                                             data.quantity * data.sell)}
                    </div>
                </div>
            </div>
        ) : (
            <div className="order-history-tile">
                <div className="order-history-tile-header">
                    <div className="order-history-tile-header-left">BUY</div>
                    <div className="order-history-tile-header-right">{data.symbol}</div>
                </div>
                <div className="order-history-tile-labels">
                    <div className="order-history-tile-label">Quantity</div>
                    <div className="order-history-tile-label">Price</div>
                    <div className="order-history-tile-label">Total Value</div>
                </div>
                <div className="order-history-tile-values">
                    <div className="order-history-tile-value">{data.quantity}</div>
                    <div className="order-history-tile-value">${parsePrice(data.buy)}</div>
                    <div className="order-history-tile-value">${parsePrice(data.quantity * data.buy)}</div>
                </div>
                <div className="order-history-tile-labels">
                    <div className="order-history-tile-label">Date</div>
                </div>
                <div className="order-history-tile-values">
                    <div className="order-history-tile-value">{parseLabel(data.timestamp)}</div>
                </div>
            </div>
        )}
        </div>
    );
};

export default OrderHistoryTile;