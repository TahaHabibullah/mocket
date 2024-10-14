import React, { act } from "react";
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import Home from '../components/Home.js';
import { UserContext } from "../components/UserContext.js";

jest.mock("axios");
jest.mock("react-chartjs-2", () => ({
    Line: () => null
}));
const mockUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
   ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));

test("doesn't call api when user is null", async () => {
    const mockUser = null;
    const mockResponse = "test";

    axios.get.mockResolvedValue({ data: mockResponse });
    await act( async () => render(
        <UserContext.Provider value={{ user: mockUser }}>
            <Home/>
        </UserContext.Provider>
    ));
    expect(axios.get).toHaveBeenCalledTimes(0);
    const error = screen.queryByText("Error");
    expect(error).toBeNull();
});

test("uses context user data, fetches quote data, renders all children", async () => {
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

    const mockHomeResponse = [
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
    const mockOHResponse = [
        [
            {
                "buy": 218.24,
                "quantity": 10,
                "sell": 0,
                "symbol": "AAPL",
                "timestamp": "2024-07-30 03:44:35"
            }
        ]
    ];

    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: mockOHResponse });
    axios.get.mockResolvedValueOnce({ data: mockHomeResponse });
    const { getByPlaceholderText, getByText } = await act( async () => render(
        <UserContext.Provider value={{ user: mockUser }}>
            <Home/>
        </UserContext.Provider>
    ));
    expect(getByPlaceholderText(/Search/i)).toBeInTheDocument();
    expect(getByText(/20000/i)).toBeInTheDocument();
    expect(getByText(/Your Positions/i)).toBeInTheDocument();
    expect(getByText(/2182.4/i)).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalled();
    const error = screen.queryByText("Error");
    expect(error).toBeNull();
});

test("uses context user data, fetches quote data, does not render pos list", async () => {
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
                "sell": 218.24,
                "open": false,
                "openTimestamp": "2024-07-30 03:44:35",
                "closeTimestamp": "2024-07-30 03:44:45"
            }
        ]
    };

    const mockOHResponse = [
        [
            {
                "buy": 218.24,
                "quantity": 10,
                "sell": 0,
                "symbol": "AAPL",
                "timestamp": "2024-07-30 03:44:35"
            },
            {
                "buy": 218.24,
                "quantity": 10,
                "sell": 218.24,
                "symbol": "AAPL",
                "timestamp": "2024-07-30 03:44:45"
            }   
        ]
    ];

    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: mockOHResponse });
    axios.get.mockResolvedValueOnce({ data: [] });
    const { getByPlaceholderText, getByText } = await act( async () => render(
        <UserContext.Provider value={{ user: mockUser }}>
            <Home/>
        </UserContext.Provider>
    ));
    expect(getByPlaceholderText(/Search/i)).toBeInTheDocument();
    expect(getByText(/20000/i)).toBeInTheDocument();
    expect(getByText(/Buy Price/i)).toBeInTheDocument();
    expect(getByText(/Sell Price/i)).toBeInTheDocument();
    const value = screen.getAllByText(/2182.40/i);
    expect(value).toHaveLength(2);
    expect(axios.get).toHaveBeenCalled();
    expect(screen.queryByText("Error")).toBeNull();
    expect(screen.queryByText("Your Positions")).toBeNull();
});

test("uses context user data, fails to fetch quote data, alert shown, does not render pos list", async () => {
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
    const mockHomeResponse = [
        {
            "extended_timestamp": 0,
            "is_market_open": false,
            "timestamp": 0
        }
    ];
    const mockOHResponse = [
        [
            {
                "buy": 218.24,
                "quantity": 10,
                "sell": 0,
                "symbol": "AAPL",
                "timestamp": "2024-07-30 03:44:35"
            }
        ]
    ];

    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: mockOHResponse });
    axios.get.mockResolvedValueOnce({ data: mockHomeResponse });
    const { getByPlaceholderText, getByText } = await act( async () => render(
        <UserContext.Provider value={{ user: mockUser }}>
            <Home/>
        </UserContext.Provider>
    ));
    const alerts = screen.getAllByText(/Error/i);
    expect(alerts).toHaveLength(2);
    expect(getByPlaceholderText(/Search/i)).toBeInTheDocument();
    expect(getByText(/20000/i)).toBeInTheDocument();
    expect(getByText(/2182.4/i)).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalled();
});

test("uses context user data, fetches empty quote data, alert shown, does not render pos list", async () => {
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
    const mockOHResponse = [
        [
            {
                "buy": 218.24,
                "quantity": 10,
                "sell": 0,
                "symbol": "AAPL",
                "timestamp": "2024-07-30 03:44:35"
            }
        ]
    ];

    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: mockOHResponse });
    axios.get.mockResolvedValueOnce({ data: [] });
    const { getByPlaceholderText, getByText } = await act( async () => render(
        <UserContext.Provider value={{ user: mockUser }}>
            <Home/>
        </UserContext.Provider>
    ));
    expect(getByText(/Error/i)).toBeInTheDocument();
    expect(getByPlaceholderText(/Search/i)).toBeInTheDocument();
    expect(getByText(/20000/i)).toBeInTheDocument();
    expect(getByText(/2182.4/i)).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalled();
});

test("user positions is empty, does not render pos list or order hist", async () => {
    const mockUser = {
        "id": "66a8957e631f435b8dcc2d43",
        "email": "test3@test.com",
        "balance": 20000.0,
        "positions": []
    };
    const mockResponse = [];

    axios.get.mockResolvedValue({ data: mockResponse });
    const { getByPlaceholderText, getByText } = await act( async () => render(
        <UserContext.Provider value={{ user: mockUser }}>
            <Home/>
        </UserContext.Provider>
    ));
    expect(getByPlaceholderText(/Search/i)).toBeInTheDocument();
    expect(getByText(/20000/i)).toBeInTheDocument();
    expect(screen.queryByText("Error")).toBeNull();
    expect(screen.queryByText("Order History")).toBeNull();
    expect(screen.queryByText("Your Positions")).toBeNull();
    expect(axios.get).toHaveBeenCalled();
});