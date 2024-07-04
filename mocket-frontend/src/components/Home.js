import React, { useContext } from "react";
import MocketNavBar from "./MocketNavBar";
import PositionsList from "./PositionsList";
import { UserContext } from "./UserContext";
import { getOpenPositions } from "./Utils";
import '../styling/App.css';
import '../styling/Home.css';

const Home = () => {
    const user = useContext(UserContext);

    return (
        <div className="App">
            {user ? (
                <div>
                    <MocketNavBar/>
                    <div className="home-header">
                        <div className="home-header-balance">{user.balance}</div>
                    </div>
                    <PositionsList/>
                </div>
            ) : (
                <div/>
            )}
        </div>
    )
}

export default Home;