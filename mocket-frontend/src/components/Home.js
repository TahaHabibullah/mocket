import React, { useEffect, useState } from "react";
import MocketNavBar from "./MocketNavBar";
import PositionsList from "./PositionsList"
import TradeActions from "./TradeActions";
import { getOpenPositions } from "./Utils";
import '../styling/App.css';
import '../styling/Home.css';

const Home = () => {
    const restEndpoint = "http://19.26.28.37:8080/database/user/666f3772a145123a860ad98e"
    const [user, setUser] = useState(null);
    const callRestApi = async () => {
        return fetch(restEndpoint, {
            method: 'GET', 
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            setUser(responseJson);
        })
    }

    useEffect(() => {
        callRestApi();
    }, [])

    return (
        <div className="App">
            {user ? (
                <div>
                    <MocketNavBar/>
                    <div className="home-header">
                        <div className="home-header-balance">{user.balance}</div>
                    </div>
                    <TradeActions positions={[1]} live={0}/>
                    <PositionsList data={getOpenPositions(user.positions)}/>
                </div>
            ) : (
                <div/>
            )}
        </div>
    )
}

export default Home;