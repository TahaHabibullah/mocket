import React, { act } from "react";
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import OrderHistory from '../components/OrderHistory.js';

jest.mock("axios");

test("component renders correctly", async () => {
    const mockResponse = [
        {
            "buy": 218.24,
            "quantity": 10,
            "sell": 0,
            "symbol": "AAPL",
            "timestamp": "2024-07-30 03:44:35"
        }
    ];

    axios.get.mockResolvedValue({ data: mockResponse });
    const { container, getByText } = await act( async () => render(<OrderHistory id={0}/>));
    expect(container.querySelector(".order-history-accordion")).toBeInTheDocument();
    expect(container.querySelector(".order-history-divider")).toBeInTheDocument();
    expect(container.querySelector(".order-history-panel")).toBeInTheDocument();
    expect(getByText(/AAPL/i)).toBeInTheDocument();
    expect(getByText(/218.24/i)).toBeInTheDocument();
    expect(getByText(/2182.40/i)).toBeInTheDocument();
});

test("component renders both buy and sell tiles correctly", async () => {
    const mockResponse = [
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

    axios.get.mockResolvedValue({ data: mockResponse });
    const { container, getByText } = await act( async () => render(<OrderHistory id={0}/>));
    expect(container.querySelector(".order-history-accordion")).toBeInTheDocument();
    expect(container.querySelector(".order-history-divider")).toBeInTheDocument();
    expect(container.querySelector(".order-history-panel")).toBeInTheDocument();
    expect(getByText(/Buy Price/i)).toBeInTheDocument();
    expect(getByText(/Sell Price/i)).toBeInTheDocument();
    const value = screen.getAllByText(/2182.40/i);
    expect(value).toHaveLength(2);
});

test("fetch results in error, does not render", async () => {
    axios.get.mockRejectedValue(new Error("error"));
    const { container, getByText } = await act( async () => render(<OrderHistory id={0}/>));
    expect(getByText(/Failed to fetch from backend./i)).toBeInTheDocument();
    expect(container.querySelector(".order-history-accordion")).toBeNull();
    expect(container.querySelector(".order-history-divider")).toBeNull();
    expect(container.querySelector(".order-history-panel")).toBeNull();
    expect(screen.queryByText("Order History")).toBeNull();
});