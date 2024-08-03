import React, { act } from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import TradeActions from "../components/TradeActions.js";
import { UserContext } from "../components/UserContext.js";

test("component renders correctly with position", async () => {
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

    const { getByText } = await act( async () => render(
        <UserContext.Provider value={{ user: mockUser }}>
            <TradeActions symbol="AAPL" positions={mockUser.positions} live={215.16}/>
        </UserContext.Provider>
    ));
    expect(getByText(/BUY/i)).toBeInTheDocument();
    expect(getByText(/SELL/i)).toBeInTheDocument();
});

test("component renders correctly without position", async () => {
    const mockUser = {
        "id": "66a8957e631f435b8dcc2d43",
        "email": "test3@test.com",
        "balance": 20000.0,
        "positions": []
    };

    const { getByText } = await act( async () => render(
        <UserContext.Provider value={{ user: mockUser }}>
            <TradeActions symbol="AAPL" positions={mockUser.positions} live={215.16}/>
        </UserContext.Provider>
    ));
    expect(getByText(/BUY/i)).toBeInTheDocument();
    const sellButton = screen.queryByText("SELL");
    expect(sellButton).toBeNull();
});

test("pressing buttons reveals/hides Buy/Sell panel", async () => {
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

    const { getByText } = await act(async () => render(
        <UserContext.Provider value={{ user: mockUser }}>
            <TradeActions symbol="AAPL" positions={mockUser.positions} live={215.16}/>
        </UserContext.Provider>
    ));

    var left = await screen.findByTestId("left");
    var right = await screen.findByTestId("right");
    var buy = window.getComputedStyle(left);
    var sell = window.getComputedStyle(right);
    expect(buy.maxHeight).toBe("");
    expect(sell.maxHeight).toBe("");
    
    fireEvent.click(getByText("BUY"));
    left = await screen.findByTestId("left");
    right = await screen.findByTestId("right");
    buy = window.getComputedStyle(left);
    sell = window.getComputedStyle(right);
    expect(buy.maxHeight).toBe("0px");
    expect(sell.maxHeight).toBe("");


    fireEvent.click(getByText("BUY"));
    fireEvent.click(getByText("SELL"));
    left = await screen.findByTestId("left");
    right = await screen.findByTestId("right");
    buy = window.getComputedStyle(left);
    sell = window.getComputedStyle(right);
    expect(buy.maxHeight).toBe("");
    expect(sell.maxHeight).toBe("0px");

});