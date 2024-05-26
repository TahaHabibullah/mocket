import React from "react";

import "./SymbolSearch.css";
import { FaSearch } from "react-icons/fa";
import { checkInput } from "./Utils";

const SymbolSearch = ( {setResults} ) => {
    const restEndpoint = "http://localhost:8080/trade-service/ticker/search";

    const callRestApi = async (symbol) => {
        const body = {"symbol": symbol, "country": "United States", "outputsize": 10}
        return fetch(restEndpoint, {
            method:'POST', 
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, 
            body: JSON.stringify(body)
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            setResults(responseJson);
        })
    }

    const handleChange = (e) => {
        e.preventDefault();
        const val = checkInput(e.target.value);
        callRestApi(val);
    }

    return (
        <div className="input-box">
            <FaSearch id="search-icon"/>
            <input placeholder="Enter Symbol Here" onChange={handleChange}></input>
        </div>
    )
}

export default SymbolSearch;