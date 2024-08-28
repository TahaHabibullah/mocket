import React from "react";
import { render, screen } from '@testing-library/react';
import OrderHistoryList from '../components/OrderHistoryList.js';

test("component renders correctly", async () => {
    const mockData = [
        {
            "buy": 218.24,
            "quantity": 10,
            "sell": 0,
            "symbol": "AAPL",
            "timestamp": "2024-07-30 03:44:35"
        }
    ];

    const { container, getByText } = render(<OrderHistoryList hist={mockData}/>);
    expect(container.querySelector(".order-history-list")).toBeInTheDocument();
    expect(container.querySelector(".order-history-list-divider")).toBeNull();
    expect(getByText(/AAPL/i)).toBeInTheDocument();
    expect(getByText(/218.24/i)).toBeInTheDocument();
    expect(getByText(/2182.40/i)).toBeInTheDocument();
});

test("component renders multiple tiles correctly", async () => {
    const mockData = [
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
    ];

    const { container, getByText } = render(<OrderHistoryList hist={mockData}/>);
    expect(container.querySelector(".order-history-list")).toBeInTheDocument();
    expect(container.querySelector(".order-history-list-divider")).toBeInTheDocument();
    expect(getByText(/Buy Price/i)).toBeInTheDocument();
    expect(getByText(/Sell Price/i)).toBeInTheDocument();
    const value = screen.getAllByText(/2182.40/i);
    expect(value).toHaveLength(2);
});