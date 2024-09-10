import React, { useContext, useEffect, useState } from "react";
import MocketNavBar from "./MocketNavBar";
import PositionsList from "./PositionsList";
import HomePriceChart from "./HomePriceChart";
import Alert from "./Alert";
import { UserContext } from "./UserContext";
import { getOpenPositions, getPortfolioValue, 
         getPortfolioPrevClose, getCombinedPositions, 
         checkQuoteListError} from "./Utils";
import axios from "axios";
import '../styling/App.css';
import '../styling/Home.css';
import OrderHistory from "./OrderHistory";

const Home = () => {
    const restEndpoint = 'http://localhost:8080/database/user/getQuotes?id=';
    const { user } = useContext(UserContext);
    const [quotes, setQuotes] = useState([]);
    const [error, setError] = useState(null);

    const callRestApi = async () => {
        return axios.get(restEndpoint + user.id)
        .then((response) => {
            if(response.data.length > 0) {
                if(checkQuoteListError(response.data)) {
                    setError("API limit exceeded. Try again later.");
                }
                else {
                    setQuotes(response.data);
                }
            }
        }).catch(error => {
            setError("Failed to fetch from backend.");
            console.log(error);
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
                <Alert message={error} style={"error"} setAlert={setError}/>
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
                    <OrderHistory id={user.id}/>
                </div>
            ) : (
                <div/>
            )}
        </div>
    )
}

export default Home;