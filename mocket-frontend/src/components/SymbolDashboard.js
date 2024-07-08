import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { parsePrice, getOpenPositions, getSymPositions } from "./Utils";
import QuoteDataGrid from "./QuoteDataGrid";
import PriceChart from "./PriceChart";
import MocketNavBar from "./MocketNavBar";
import PositionsSummary from "./PositionsSummary";
import TradeActions from "./TradeActions";
import { UserContext } from "./UserContext";
import '../styling/App.css';


const SymbolDashboard = () => {
    const user = useContext(UserContext);
    const liveEndpoint = "http://19.26.28.37:8080/trade-service/live/price?symbol=";
    const restEndpoint = "http://19.26.28.37:8080/trade-service/quote";
    const { symbol } = useParams();
    const [liveData, setLiveData] = useState(null);
    const [quoteData, setQuoteData] = useState(null);
    const [marketOpen, setMarketOpen] = useState(null);

    useEffect (() => {
        callRestApi();
        if(marketOpen) {
            const source = new EventSource(liveEndpoint + symbol);
            source.onopen = () => {
                console.log("LivePriceData: EventSource connection opened");
            }

            source.onmessage = (e) => {
                console.log(e.data);
                setLiveData(parsePrice(e.data));
            }

            source.onerror = () => {
                console.log("LivePriceData: Error occurred while fetching live price");
                source.close();
            }
            return () => {
                console.log("LivePriceData: EventSource connection closed");
                source.close();
            }
        }
        else if(marketOpen === false) {
            console.log("LivePriceData: Market is closed");
        }

    }, [marketOpen]);

    const callRestApi = async () => {
        const body = {symbol};
        return fetch(restEndpoint, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            setQuoteData(responseJson);
            setMarketOpen(responseJson.is_market_open);
            setLiveData(parsePrice(responseJson.close));
        })
    }

    return (
        <div className="App">
            {user && quoteData ? (
                <div>
                    <MocketNavBar/>
                    <PriceChart liveData={liveData} quoteData={quoteData}/>
                    <TradeActions symbol={symbol} positions={user.positions} live={liveData}/>
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