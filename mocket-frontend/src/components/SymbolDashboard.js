import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { parsePrice, getOpenPositions, getSymPositions } from "./Utils";
import QuoteDataGrid from "./QuoteDataGrid";
import PriceChart from "./PriceChart";
import MocketNavBar from "./MocketNavBar";
import PositionsSummary from "./PositionsSummary";
import TradeActions from "./TradeActions";
import Alert from "./Alert";
import { UserContext } from "./UserContext";
import axios from "axios";
import '../styling/App.css';

const SymbolDashboard = () => {
    const { user } = useContext(UserContext);
    const liveEndpoint = '/trade-service/live/price?symbol=';
    const restEndpoint = '/trade-service/quote';
    const { symbol } = useParams();
    const [liveData, setLiveData] = useState(null);
    const [quoteData, setQuoteData] = useState(null);
    const [marketOpen, setMarketOpen] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        callRestApi();
    }, [])

    useEffect(() => {
        if(marketOpen) {
            const source = new EventSource(liveEndpoint + symbol);
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
        else if(marketOpen === false) {
        }

    }, [marketOpen]);

    const callRestApi = async () => {
        const body = {symbol};
        return axios.post(restEndpoint, body)
        .then((response) => {
            if(response.data.timestamp === 0) {
                setError("API limit exceeded. Try again later.");
            }
            else {
                setQuoteData(response.data);
                setMarketOpen(response.data.is_market_open);
                setLiveData(parsePrice(response.data.close));
            }
        }).catch(error => {
            setError("Failed to fetch data from API.");
            console.log(error);
        })
    }

    return (
        <div className="App">
            <MocketNavBar/>
            {error ? (
                <Alert message={error} style={"error"} setError={setError}/>
            ) : (
                <div/>
            )}
            {user && quoteData ? (
                <div>
                    <PriceChart liveData={liveData} quoteData={quoteData}/>
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
        </div>
    )
}

export default SymbolDashboard;