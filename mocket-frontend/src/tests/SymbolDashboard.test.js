import React, { act } from "react";
import { render, waitFor } from '@testing-library/react';
import SymbolDashboard from "../components/SymbolDashboard.js";
import { UserContext } from "../components/UserContext.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import { sources } from "eventsourcemock";

jest.mock("axios");
jest.mock("react-chartjs-2", () => ({
    Line: () => null
}));
const mockUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
   ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
  useParams: jest.fn()
}));

test("component renders all children correctly", async () => {
    useParams.mockReturnValue({ symbol: "AAPL" });
    const message = new MessageEvent("foo", { data: 218.12 });

    const mockUser = {
        "id": "66a8957e631f435b8dcc2d43",
        "email": "test3@test.com",
        "balance": 20000.0,
        "positions": [
            {
                "id": "66a899e3631f435b8dcc2d45",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 218.24,
                "sell": 0,
                "open": true,
                "openTimestamp": "2024-07-30 03:44:35",
                "closeTimestamp": null
            }
        ]
    };

    const mockResponse = {
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
    };

    axios.post.mockResolvedValue({ data: mockResponse });
    const { container, getByPlaceholderText, getByText } = await act( async () => render(
        <UserContext.Provider value={{ user: mockUser }}>
            <SymbolDashboard/>
        </UserContext.Provider>
    ));

    await waitFor(() => {
        expect(getByPlaceholderText(/Search/i)).toBeInTheDocument();
        expect(getByText(/Apple Inc/i)).toBeInTheDocument();
        expect(getByText(/BUY/i)).toBeInTheDocument();
        expect(getByText(/SELL/i)).toBeInTheDocument();
        expect(getByText(/Average Volume/i)).toBeInTheDocument();
        expect(getByText(/41.58M/i)).toBeInTheDocument();
        expect(getByText(/1Y/i)).toBeInTheDocument();
        expect(container.querySelector(".quote-header-diff-green")).toBeInTheDocument();
        expect(container.querySelector(".price-chart")).toBeInTheDocument();
        expect(container.querySelector(".price-chart-divider")).toBeInTheDocument();
        expect(container.querySelector(".quote-data-grid-header")).toBeInTheDocument();
        expect(container.querySelector(".quote-data-grid-divider")).toBeInTheDocument();
    });
});