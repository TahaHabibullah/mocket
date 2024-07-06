import React, { useContext, useEffect, useState } from "react";
import MocketNavBar from "./MocketNavBar";
import PositionsList from "./PositionsList";
import { UserContext } from "./UserContext";
import { getOpenPositions, getPortfolioValue, parsePrice } from "./Utils";
import '../styling/App.css';
import '../styling/Home.css';

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
                    {quotes.length > 0 ? (
                        <div>
                            <div className="home-header">
                                <div className="home-header-balance">${getPortfolioValue(getOpenPositions(user.positions), user.balance, quotes)}</div>
                            </div>
                            <PositionsList quoteList={quotes}/>
                        </div>
                    ) : (
                        <div className="home-header">
                            <div className="home-header-balance">${parsePrice(user.balance)}</div>
                        </div>
                    )}
                </div>
            ) : (
                <div/>
            )}
        </div>
    )
}

export default Home;