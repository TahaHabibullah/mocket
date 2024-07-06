import React, { useContext, useEffect, useState } from "react";
import MocketNavBar from "./MocketNavBar";
import PositionsList from "./PositionsList";
import { UserContext } from "./UserContext";
import { getOpenPositions, parsePrice, getSymbols } from "./Utils";
import '../styling/App.css';
import '../styling/Home.css';

const Home = () => {
    const restEndpoint = "http://19.26.28.37:8080/trade-service/quote";
    const user = useContext(UserContext);
    const [quotes, setQuotes] = useState([]);

    const callRestApi = async (symbol) => {
        const body = {symbol};
        return fetch(restEndpoint, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            let temp = quotes.slice();
            temp.push(responseJson);
            setQuotes(temp);
        })
    }

    useEffect(() => {
        if(user) {
            const symbols = getSymbols(getOpenPositions(user.positions));
            if(symbols.length > 0) {
                for(var i = 0; i < symbols.length; i++) {
                    callRestApi(symbols[i]);
                }
            }
        }
    }, [user])

    return (
        <div className="App">
            {user ? (
                <div>
                    <MocketNavBar/>
                    <div className="home-header">
                        <div className="home-header-balance">${parsePrice(user.balance)}</div>
                    </div>
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