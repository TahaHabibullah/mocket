import React, { useState } from "react";
import Alert from "./Alert";
import "../styling/SymbolSearch.css";
import { FaSearch } from "react-icons/fa";
import { checkInput } from "./Utils";
import axios from "axios";

const SymbolSearch = ( {setResults} ) => {
    const restEndpoint = '/trade-service/ticker/search';
    const [error, setError] = useState(null);

    const callRestApi = async (symbol) => {
        const body = {
            "symbol": symbol, 
            "country": "United States", 
            "outputSize": 10
        }
        return axios.post(restEndpoint, body)
        .then((response) => {
            if(response.data.status === "error") {
                setError("Unexpected API failure.")
            }
            else {
                setResults(response.data);
            }
        }).catch(error => {
            setError("Failed to fetch search results.");
            console.log(error);
        });
    };

    const handleChange = (e) => {
        e.preventDefault();
        const val = e.target.value;
        if(checkInput(val)) {
            callRestApi(val);
        }
        else {
            setTimeout(() => setResults([]), 200);
        }
    };

    const handleBlur = () => {
        setTimeout(() => setResults([]), 200);
    };

    return (
        <div>
            {error ? (
                <Alert message={error} style={"error"} setAlert={setError}/>
            ) : (
                <div/>
            )}
            <div className="input-box">
                <FaSearch id="search-icon"/>
                <input placeholder="Search" onChange={handleChange} onBlur={handleBlur}/>
            </div>
        </div>
    );
};

export default SymbolSearch;