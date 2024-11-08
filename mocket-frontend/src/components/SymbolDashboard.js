import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { parsePrice, getOpenPositions, getSymPositions, isMarketOpen } from "./Utils";
import QuoteDataGrid from "./QuoteDataGrid";
import PriceChart from "./PriceChart";
import MocketNavBar from "./MocketNavBar";
import PositionsSummary from "./PositionsSummary";
import TradeActions from "./TradeActions";
import Alert from "./Alert";
import Footer from "./Footer";
import { UserContext } from "./UserContext";
import axios from "axios";
import { SSE } from 'sse.js';
import '../styling/App.css';

const SymbolDashboard = () => {
    const { user } = useContext(UserContext);
    const liveEndpoint = 'http://localhost:8080/trade-service/live/price?symbol=';
    const restEndpoint = 'http://localhost:8080/trade-service/quote';
    const { symbol } = useParams();
    const { state } = useLocation();
    const [liveData, setLiveData] = useState(null);
    const [quoteData, setQuoteData] = useState(null);
    const marketOpen = isMarketOpen();
    const [error, setError] = useState(null);
    var source;

    useEffect(() => {
        callRestApi();
    }, [symbol]);

    useEffect(() => {
        if(marketOpen) {
            if(source) {
                source.close();
            }
            source = new SSE(liveEndpoint + symbol, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token')
                }
            });
            source.onopen = () => {
            }

            source.onmessage = (e) => {
                setLiveData(parsePrice(e.data));
            }

            source.onerror = () => {
                setError("Failed to fetch live price.");
                source.close();
            }
            return () => {
                source.close();
            }
        }
    }, [symbol]);

    const callRestApi = async () => {
        const body = {symbol};
        return axios.post(restEndpoint, body)
        .then((response) => {
            if(response.data.timestamp === 0) {
                setError("API limit exceeded. Try again later.");
            }
            else {
                setQuoteData(response.data[0]);
                setLiveData(parsePrice(response.data[0].close));
            }
        }).catch(error => {
            setError("Failed to fetch data from API.");
            console.log(error);
        });
    };

    return (
        <div className="App">
            <MocketNavBar style="dashboard"/>
            {error ? (
                <Alert message={error} style={"error"} setAlert={setError}/>
            ) : (
                <div/>
            )}
            {user && quoteData ? (
                <div>
                    <PriceChart name={state?.name} liveData={liveData} quoteData={quoteData} isMarketOpen={marketOpen}/>
                    <TradeActions symbol={symbol} positions={getSymPositions(getOpenPositions(user.positions), symbol)} live={liveData}/>
                    {getSymPositions(getOpenPositions(user.positions), symbol).length > 0 ? (
                        <PositionsSummary positions={getSymPositions(getOpenPositions(user.positions), symbol)} live={liveData}/> 
                    ) : (
                        <div/>
                    )}
                    <QuoteDataGrid data={quoteData}/>
                </div>
            ) : (
                <div/>
            )}
            <Footer/>
        </div>
    );
};

export default SymbolDashboard;