import React, { useEffect, useState } from "react";
import Alert from "./Alert";
import axios from "axios";
import OrderHistoryList from "./OrderHistoryList.js";
import "../styling/OrderHistory.css";

const OrderHistory = ({ id }) => {
    const restEndpoint = 'http://localhost:8080/database/user/getHist?id=';
    const [error, setError] = useState(null);
    const [orderHist, setOrderHist] = useState(null);
    const [curr, setCurr] = useState(1);

    const handleToggle = () => {
        var acc = document.getElementById("hist");
        var panel = acc.nextElementSibling.nextElementSibling;
        acc.classList.toggle("order-history-active");
        if(panel.style.maxHeight) {
            panel.style.maxHeight = null;
            panel.style.borderWidth = "0px";
        }
        else {
            panel.style.maxHeight = panel.scrollHeight + "px";
            panel.style.borderWidth = "1px";
        }
    }

    const callRestApi = async () => {
        return axios.get(restEndpoint + id)
        .then((response) => {
            if(response.data.length > 0) {
                setOrderHist(response.data);
            }
        }).catch(error => {
            setError("Failed to fetch from backend.");
            console.log(error);
        })
    }

    const nextPage = () => {
        if (curr < orderHist.length) {
            setCurr(curr + 1);
        }   
    }
    
    const prevPage = () => {
        if (curr > 1) {
            setCurr(curr - 1);
        }
    }

    useEffect(() => {
        callRestApi();
    }, []);

    useEffect(() => {
        if(orderHist) {
            const acc = document.getElementById("hist");
            const panel = acc.nextElementSibling.nextElementSibling;
            panel.style.maxHeight = panel.scrollHeight + "px";
            panel.style.borderWidth = "1px";
        }
    }, [curr])

    return (
        <div>
            {error ? (
                <Alert message={error} style={"error"} setAlert={setError}/>
            ) : (
                <div/>
            )}
            {orderHist ? (
                <div className="order-history">
                    <div id="hist" className="order-history-accordion" onClick={handleToggle}>Order History</div>
                    <div className="order-history-divider"/>
                    <div className="order-history-panel">
                        <div className="order-history-pagination">
                            <button 
                                className="order-history-pagination-button"
                                onClick={prevPage}
                                disabled={curr === 1}
                            >
                                &lt;
                            </button>
                            <div className="order-history-pagination-count">
                                {curr} of {orderHist.length}
                            </div>
                            <button
                                className="order-history-pagination-button"
                                onClick={nextPage}
                                disabled={curr === orderHist.length}
                            >
                                &gt;
                            </button>
                        </div>
                        <div className="order-history-divider"/>
                        <OrderHistoryList hist={orderHist[curr-1]}/>
                    </div>
                </div>
            ) : ( 
                <div/>
            )}
        </div>
    );
}

export default OrderHistory;