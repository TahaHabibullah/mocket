import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Home from '../components/Home.js';
import { UserProvider } from "../components/UserProvider";

jest.mock('axios');

test("fetches user data", async () => {
    const mockResponse = [
        {
            "symbol": "AAPL",
            "name": "Apple Inc",
            "exchange": "NASDAQ",
            "mic_code": "XNGS",
            "currency": "USD",
            "datetime": "2024-07-26",
            "timestamp": 1722000600,
            "open": "218.70000",
            "high": "219.49001",
            "low": "216.00999",
            "close": "217.96001",
            "volume": "41580100",
            "previous_close": "217.49001",
            "change": "0.47000",
            "percent_change": "0.21610",
            "average_volume": "52130860",
            "fifty_two_week": {
                "low": "164.08000",
                "high": "237.23000",
                "low_change": "53.88000",
                "high_change": "-19.26999",
                "low_change_percent": "32.83764",
                "high_change_percent": "-8.12291",
                "range": "164.080002 - 237.229996"
            },
            "extended_timestamp": 0,
            "is_market_open": false
        }
    ]

    axios.get.mockResolvedValue(mockResponse);
    render(
        <UserProvider>
            <Home/>
        </UserProvider>
    );
    const symbolElement = await waitFor(() => screen.getByText(/AAPL/i))
    expect(symbolElement).toBeInTheDocument();
});