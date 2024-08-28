import React from "react";
import { render, screen } from '@testing-library/react';
import OrderHistoryTile from '../components/OrderHistoryTile.js';

test("component renders correctly (buy)", async () => {
    const mockData = {
        "buy": 218.24,
        "quantity": 10,
        "sell": 0,
        "symbol": "AAPL",
        "timestamp": "2024-07-30 03:44:35"
    };

    const { container, getByText } = render(<OrderHistoryTile data={mockData}/>);
    expect(container.querySelector(".order-history-tile")).toBeInTheDocument();
    const labels = container.getElementsByClassName("order-history-tile-labels");
    expect(labels).toHaveLength(2);
    const values = container.getElementsByClassName("order-history-tile-values");
    expect(values).toHaveLength(2);
    expect(getByText(/BUY/i)).toBeInTheDocument();
    expect(getByText(/AAPL/i)).toBeInTheDocument();
    expect(getByText(/Price/i)).toBeInTheDocument();
    expect(getByText(/Quantity/i)).toBeInTheDocument();
    expect(getByText(/Total Value/i)).toBeInTheDocument();
    expect(getByText(/Date/i)).toBeInTheDocument();
    expect(getByText(/218.24/i)).toBeInTheDocument();
    expect(getByText(/2182.40/i)).toBeInTheDocument();
    expect(getByText(/Jul 30 3:44 AM/i)).toBeInTheDocument();
});

test("component renders correctly (sell)", async () => {
    const mockData = {
        "buy": 218.24,
        "quantity": 10,
        "sell": 218.24,
        "symbol": "AAPL",
        "timestamp": "2024-07-30 03:44:45"
    };

    const { container, getByText } = render(<OrderHistoryTile data={mockData}/>);
    expect(container.querySelector(".order-history-tile")).toBeInTheDocument();
    const labels = container.getElementsByClassName("order-history-tile-labels");
    expect(labels).toHaveLength(2);
    const values = container.getElementsByClassName("order-history-tile-values");
    expect(values).toHaveLength(2);
    expect(getByText(/AAPL/i)).toBeInTheDocument();
    expect(getByText(/Buy Price/i)).toBeInTheDocument();
    expect(getByText(/Sell Price/i)).toBeInTheDocument();
    expect(getByText(/Quantity/i)).toBeInTheDocument();
    expect(getByText(/Total Value/i)).toBeInTheDocument();
    expect(getByText(/Date/i)).toBeInTheDocument();
    expect(getByText(/Total Return/i)).toBeInTheDocument();
    expect(getByText(/2182.40/i)).toBeInTheDocument();
    expect(getByText(/Jul 30 3:44 AM/i)).toBeInTheDocument();
    const value = screen.getAllByText(/218.24/i);
    expect(value).toHaveLength(2);
});