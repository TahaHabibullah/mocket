import React, { useState } from "react";
import Alert from "./Alert";
import "../styling/SymbolSearch.css";
import { FaSearch } from "react-icons/fa";
import { checkInput } from "./Utils";

const SymbolSearch = ( {setResults} ) => {
    const restEndpoint = "http://19.26.28.37:8080/trade-service/ticker/search";
    const [error, setError] = useState(null);

    const callRestApi = async (symbol) => {
        const body = {"symbol": symbol, "country": "United States", "outputsize": 10}
        return fetch(restEndpoint, {
            method:'POST', 
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, 
            body: JSON.stringify(body)
        })
        .then((response) => { if(response.ok) return response.json() })
        .then((responseJson) => {
            console.log(responseJson);
            setResults(responseJson);
        }).catch(error => {
            setError("Failed to fetch search results.");
            console.log(error);
        })
    }

    const handleChange = (e) => {
        e.preventDefault();
        const val = checkInput(e.target.value);
        callRestApi(val);
    }

    return (
        <div>
            {error ? (
                <Alert message={error} style={"error"} setError={setError}/>
            ) : (
                <div/>
            )}
            <div className="input-box">
                <FaSearch id="search-icon"/>
                <input placeholder="Search" onChange={handleChange}/>
            </div>
        </div>
    )
}

export default SymbolSearch;