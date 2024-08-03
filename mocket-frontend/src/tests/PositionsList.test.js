import React from "react";
import { render } from '@testing-library/react';
import PositionsList from "../components/PositionsList.js";

const mockUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
   ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));


test("component renders correctly", async () => {
    const posMap = new Map();
    posMap.set("AAPL", 
    {
        "id": "66a899e3631f435b8dcc2d45",
        "symbol": "AAPL",
        "quantity": 10,
        "buy": 218.24,
        "sell": 0,
        "open": true,
        "openTimestamp": "2024-07-30 03:44:35",
        "closeTimestamp": null
    });
    posMap.set("NVDA", 
    {
        "id": "66a899e3631f435b8dcc2d22",
        "symbol": "NVDA",
        "quantity": 20,
        "buy": 106.58,
        "sell": 0,
        "open": true,
        "openTimestamp": "2024-07-21 10:23:06",
        "closeTimestamp": null
    });

    const quotes = [
        {
            "symbol": "AAPL",
            "close": "219.86000",
            "previous_close": "218.36000",
        },
        {
            "symbol": "NVDA",
            "close": "107.27000",
            "previous_close": "109.21000",
        }
    ];

    const { container, getByText } = render(<PositionsList positions={posMap} quoteList={quotes}/>);
    expect(container.querySelector(".positions-list-header")).toBeInTheDocument();
    expect(container.querySelector(".positions-list-divider")).toBeInTheDocument();
    expect(getByText(/AAPL/i)).toBeInTheDocument();
    expect(getByText(/10 shares/i)).toBeInTheDocument();
    expect(getByText(/219.86/i)).toBeInTheDocument();
    expect(getByText(/NVDA/i)).toBeInTheDocument();
    expect(getByText(/20 shares/i)).toBeInTheDocument();
    expect(getByText(/107.27/i)).toBeInTheDocument();
});

test("does not render list when map is empty, header still renders", async () => {
    const posMap = new Map();
    const quotes = [];

    const { container } = render(<PositionsList positions={posMap} quoteList={quotes}/>);
    expect(container.querySelector(".positions-list-header")).toBeInTheDocument();
    expect(container.querySelector(".positions-list-divider")).toBeInTheDocument();
    expect(container.querySelector(".positions-list-item")).toBeNull();
});