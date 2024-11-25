import React, { act } from "react";
import { render, waitFor, screen } from '@testing-library/react';
import SymbolDashboard from "../components/SymbolDashboard.js";
import { UserContext } from "../components/UserContext.js";
import { useParams } from "react-router-dom";
import axios from "axios";

jest.mock("axios");
jest.mock("react-chartjs-2", () => ({
    Line: () => null
}));
const mockUseLocationValue = {
    state: {
        name: "Apple Inc"
    }
};
jest.mock("react-router-dom", () => ({
   ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: jest.fn(),
  useLocation: jest.fn().mockImplementation(() => {
    return mockUseLocationValue
  })
}));

test("component renders all children correctly", async () => {
    useParams.mockReturnValue({ symbol: "AAPL" });

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
    ];

    axios.post.mockResolvedValue({ data: mockResponse });
    const { container, getByPlaceholderText, getByText } = await act(async () => render(
        <UserContext.Provider value={{ user: mockUser }}>
            <SymbolDashboard/>
        </UserContext.Provider>
    ));

        expect(axios.post).toHaveBeenCalled();
        expect(getByPlaceholderText(/Search/i)).toBeInTheDocument();
        expect(getByText(/Apple Inc/i)).toBeInTheDocument();
        expect(getByText(/BUY/i)).toBeInTheDocument();
        expect(getByText(/SELL/i)).toBeInTheDocument();
        expect(getByText(/Avg. Volume/i)).toBeInTheDocument();
        expect(getByText(/41.58M/i)).toBeInTheDocument();
        expect(getByText(/1Y/i)).toBeInTheDocument();
        expect(container.querySelector(".quote-header-diff-green")).toBeInTheDocument();
        expect(container.querySelector(".price-chart")).toBeInTheDocument();
        expect(container.querySelector(".price-chart-divider")).toBeInTheDocument();
        expect(container.querySelector(".quote-data-grid-header")).toBeInTheDocument();
        expect(container.querySelector(".quote-data-grid-divider")).toBeInTheDocument();
});

test("alert shown when quote fetch fails, only nav bar renders", async () => {
    useParams.mockReturnValue({ symbol: "AAPL" });

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

    axios.post.mockRejectedValue(new Error("error"));
    const { container, getByPlaceholderText, getByText } = await act(async () => render(
        <UserContext.Provider value={{ user: mockUser }}>
            <SymbolDashboard/>
        </UserContext.Provider>
    ));

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(getByPlaceholderText(/Search/i)).toBeInTheDocument();
        expect(getByText(/Failed to fetch data from API./i)).toBeInTheDocument();
        const buy = screen.queryByText("BUY");
        const sell = screen.queryByText("SELL");
        const stats = screen.queryByText("Average Volume");
        const intervals = screen.queryByText("1Y");
        expect(buy).toBeNull();
        expect(sell).toBeNull();
        expect(stats).toBeNull();
        expect(intervals).toBeNull();
        expect(container.querySelector(".quote-header-diff-green")).toBeNull();
        expect(container.querySelector(".price-chart")).toBeNull();
        expect(container.querySelector(".price-chart-divider")).toBeNull();
        expect(container.querySelector(".quote-data-grid-header")).toBeNull();
        expect(container.querySelector(".quote-data-grid-divider")).toBeNull();
    });
});

test("alert shown when quote fetch returns empty, only nav bar renders", async () => {
    useParams.mockReturnValue({ symbol: "AAPL" });

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

    const mockResponse = [];

    axios.post.mockResolvedValue({ data: mockResponse });
    const { container, getByPlaceholderText, getByText } = await act(async () => render(
        <UserContext.Provider value={{ user: mockUser }}>
            <SymbolDashboard/>
        </UserContext.Provider>
    ));

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(getByPlaceholderText(/Search/i)).toBeInTheDocument();
        expect(getByText(/Failed to fetch data from API./i)).toBeInTheDocument();
        const buy = screen.queryByText("BUY");
        const sell = screen.queryByText("SELL");
        const stats = screen.queryByText("Average Volume");
        const intervals = screen.queryByText("1Y");
        expect(buy).toBeNull();
        expect(sell).toBeNull();
        expect(stats).toBeNull();
        expect(intervals).toBeNull();
        expect(container.querySelector(".quote-header-diff-green")).toBeNull();
        expect(container.querySelector(".price-chart")).toBeNull();
        expect(container.querySelector(".price-chart-divider")).toBeNull();
        expect(container.querySelector(".quote-data-grid-header")).toBeNull();
        expect(container.querySelector(".quote-data-grid-divider")).toBeNull();
    });
});