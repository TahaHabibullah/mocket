import React, { useContext, useEffect, useState } from "react";
import MocketNavBar from "./MocketNavBar";
import PositionsList from "./PositionsList";
import HomePriceChart from "./HomePriceChart";
import Alert from "./Alert";
import { UserContext } from "./UserContext";
import { getOpenPositions, getPortfolioValue, 
         getPortfolioPrevClose, getCombinedPositions } from "./Utils";
import '../styling/App.css';
import '../styling/Home.css';

const Home = () => {
    const restEndpoint = "http://19.26.28.37:8080/database/user/getQuotes?id=";
    const { user } = useContext(UserContext);
    const [quotes, setQuotes] = useState([]);
    const [error, setError] = useState(null);

    const callRestApi = async () => {
        return fetch(restEndpoint + user.id, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        })
        .then((response) =>  { if(response.ok) return response.json() })
        .then((responseJson) => {
            console.log(responseJson);
            if(responseJson.length > 0) {
                if(responseJson[0].timestamp === 0) {
                    setError("API limit exceeded. Try again later.");
                }
                else {
                    setQuotes(responseJson);
                }
            }
        }).catch(error => {
            setError("Failed to fetch from backend.");
            console.log(error)
        })
    }

    useEffect(() => {
        if(user) {
            callRestApi();
        }
    }, [user])

    return (
        <div className="App">
            {error ? (
                <Alert message={error} style={"error"} setError={setError}/>
            ) : (
                <div/>
            )}
            {user ? (
                <div>
                    <MocketNavBar/>
                    <HomePriceChart 
                        prevClose={getPortfolioPrevClose(getOpenPositions(user.positions), user.balance, quotes)} 
                        total={getPortfolioValue(getOpenPositions(user.positions), user.balance, quotes)}
                    />
                    {quotes.length > 0 ? (  
                        <PositionsList positions={getCombinedPositions(getOpenPositions(user.positions))} quoteList={quotes}/>
                    ) : (
                        <div/>
                    )}
                </div>
            ) : (
                <div/>
            )}
        </div>
    )
}

export default Home;