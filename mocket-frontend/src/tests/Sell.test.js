import React, { act } from "react";
import { render, fireEvent } from '@testing-library/react';
import Sell from "../components/Sell.js";
import { UserContext } from "../components/UserContext.js";
import axios from "axios";

jest.mock("axios");

afterEach(() => {
    jest.clearAllMocks();
});

test("component renders correctly", async () => {
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

    const mockPositions = [
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
    ];

    const { container, getByText } = await act( async () => render(
        <UserContext.Provider value={{ user: mockUser }}>
            <Sell symbol="AAPL" positions={mockPositions} live={215.16}/>
        </UserContext.Provider>
    ));
    expect(getByText(/AAPL/i)).toBeInTheDocument();
    expect(getByText(/10 Shares/i)).toBeInTheDocument();
    expect(getByText(/215.16/i)).toBeInTheDocument();
    expect(getByText(/Trade/i)).toBeInTheDocument();
    expect(container.querySelector(".trade-panel")).toBeInTheDocument();
    expect(container.querySelector(".trade-panel-input")).toBeInTheDocument();
});

test("executes successful sell trade to backend", async () => {
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

    const mockPositions = [
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
    ];

    const mockResponse = {
        "id": "66a8957e631f435b8dcc2d43",
        "email": "test3@test.com",
        "balance": 22151.6,
        "positions": [
            {
                "id": "66a899e3631f435b8dcc2d45",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 218.24,
                "sell": 215.16,
                "open": false,
                "openTimestamp": "2024-07-30 03:44:35",
                "closeTimestamp": "2024-07-31 14:35:55"
            },
        ]
    };

    axios.put.mockResolvedValue(mockResponse);
    const { getByPlaceholderText, getByText } = await act( async () => render(
        <UserContext.Provider value={{ user: mockUser, refetch: () => {} }}>
            <Sell symbol="AAPL" positions={mockPositions} live={215.16}/>
        </UserContext.Provider>
    ));
    fireEvent.change(getByPlaceholderText("0"), {target: {value: "10"}});
    expect(getByText(/2151.6/i)).toBeInTheDocument();
    fireEvent.click(getByText(/Trade/i));
    expect(axios.put).toHaveBeenCalled();
});

test("invalid quantity, disabled button prevents trade", async () => {
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

    const mockPositions = [
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
    ];

    const { getByPlaceholderText, getByText } = await act( async () => render(
        <UserContext.Provider value={{ user: mockUser, refetch: () => {} }}>
            <Sell symbol="AAPL" positions={mockPositions} live={215.16}/>
        </UserContext.Provider>
    ));
    fireEvent.click(getByText(/Trade/i));
    fireEvent.change(getByPlaceholderText("0"), {target: {value: "-1"}});
    fireEvent.click(getByText(/Trade/i));
    fireEvent.change(getByPlaceholderText("0"), {target: {value: "100"}});
    fireEvent.click(getByText(/Trade/i));
    expect(axios.put).toHaveBeenCalledTimes(0);
});

test("alert shown upon trade failure", async () => {
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

    const mockPositions = [
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
    ];

    axios.put.mockRejectedValue(new Error("error"));
    const { getByPlaceholderText, getByText } = await act( async () => render(
        <UserContext.Provider value={{ user: mockUser, refetch: () => {} }}>
            <Sell symbol="AAPL" positions={mockPositions} live={215.16}/>
        </UserContext.Provider>
    ));
    fireEvent.change(getByPlaceholderText("0"), {target: {value: "10"}});
    await act(() => fireEvent.click(getByText(/Trade/i)));
    expect(axios.put).toHaveBeenCalled();
    expect(getByText(/Error/i)).toBeInTheDocument();
});