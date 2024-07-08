import React, { useContext, useEffect, useState } from "react";
import MocketNavBar from "./MocketNavBar";
import PositionsList from "./PositionsList";
import { UserContext } from "./UserContext";
import { getOpenPositions, getPortfolioValue, getPortfolioPrevClose } from "./Utils";
import '../styling/App.css';
import '../styling/Home.css';
import HomePriceChart from "./HomePriceChart";

const Home = () => {
    const restEndpoint = "http://19.26.28.37:8080/database/user/getQuotes?id=";
    const user = useContext(UserContext);
    const [quotes, setQuotes] = useState([]);

    const callRestApi = async () => {
        return fetch(restEndpoint + user.id, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            setQuotes(responseJson);
        })
    }

    useEffect(() => {
        if(user) {
            callRestApi();
        }
    }, [user])

    return (
        <div className="App">
            {user ? (
                <div>
                    <MocketNavBar/>
                    <HomePriceChart 
                        prevClose={getPortfolioPrevClose(user.positions, user.balance, quotes)} 
                        total={getPortfolioValue(getOpenPositions(user.positions), user.balance, quotes)}
                    />
                    {quotes.length > 0 ? (
                        <PositionsList quoteList={quotes}/>
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