import React, { useEffect, useState } from "react";
import Alert from "./Alert";
import axios from "axios";
import OrderHistoryList from "./OrderHistoryList.js";
import "../styling/OrderHistory.css";

const OrderHistory = ({ id }) => {
    const restEndpoint = 'http://localhost:8080/database/user/getHist?id=';
    const [error, setError] = useState(null);
    const [orderHist, setOrderHist] = useState(null);

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
            console.log(response.data);
            if(response.data.length > 0) {
                setOrderHist(response.data);
            }
        }).catch(error => {
            setError("Failed to fetch from backend.");
            console.log(error);
        })
    }

    useEffect(() => {
        callRestApi();
    }, []);

    return (
        <div>
            {error ? (
                <Alert message={error} style={"error"} setError={setError}/>
            ) : (
                <div/>
            )}
            {orderHist ? (
                <div className="order-history">
                    <div id="hist" className="order-history-accordion" onClick={handleToggle}>Order History</div>
                    <div className="order-history-divider"/>
                    <div className="order-history-panel">
                        <OrderHistoryList hist={orderHist}/>
                    </div>
                </div>
            ) : ( 
                <div/>
            )}
        </div>
    );
}

export default OrderHistory;