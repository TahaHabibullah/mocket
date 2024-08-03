import React from "react";
import { render } from '@testing-library/react';
import PositionsSummary from "../components/PositionsSummary.js";

test("component renders correctly", async () => {
    const posList = [
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

    const { container, getByText } = render(<PositionsSummary positions={posList} live={215.16}/>);
    expect(container.querySelector(".pos-summary-header")).toBeInTheDocument();
    expect(container.querySelector(".pos-summary-divider")).toBeInTheDocument();
    expect(container.querySelector(".pos-summary-labels")).toBeInTheDocument();
    expect(getByText(/218.24/i)).toBeInTheDocument();
    expect(getByText(/2151.60/i)).toBeInTheDocument();
    expect(getByText(/-1.41%/i)).toBeInTheDocument();
});

test("correctly combines multiple open positions", async () => {
    const posList = [
        {
            "id": "66a899e3631f435b8dcc2d45",
            "symbol": "AAPL",
            "quantity": 10,
            "buy": 218.24,
            "sell": 0,
            "open": true,
            "openTimestamp": "2024-07-30 03:44:35",
            "closeTimestamp": null
        },
        {
            "id": "66a899e3631f435b8dcc2d45",
            "symbol": "AAPL",
            "quantity": 20,
            "buy": 220.78,
            "sell": 0,
            "open": true,
            "openTimestamp": "2024-07-31 09:34:53",
            "closeTimestamp": null
        }
    ];

    const { getByText } = render(<PositionsSummary positions={posList} live={215.16}/>);
    expect(getByText(/219.93/i)).toBeInTheDocument();
    expect(getByText(/6454.80/i)).toBeInTheDocument();
    expect(getByText(/-2.17%/i)).toBeInTheDocument();
});