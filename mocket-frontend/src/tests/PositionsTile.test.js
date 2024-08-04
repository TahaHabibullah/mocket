import React from "react";
import { render, waitFor, fireEvent } from '@testing-library/react';
import PositionsTile from "../components/PositionsTile.js";

const mockUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
   ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));

test("component renders correctly", async () => {
    const position = {
        "id": "66a899e3631f435b8dcc2d45",
        "symbol": "AAPL",
        "quantity": 10,
        "buy": 218.24,
        "sell": 0,
        "open": true,
        "openTimestamp": "2024-07-30 03:44:35",
        "closeTimestamp": null
    };

    const quote = {
        "close": "219.86000",
        "previous_close": "218.36000",
    };

    const { container, getByText } = render(<PositionsTile data={position} quoteData={quote}/>);
    await waitFor(() => {
        expect(container.querySelector(".positions-tile-divider")).toBeInTheDocument();
        expect(container.querySelector(".positions-tile-data.green")).toBeInTheDocument();
        expect(getByText(/AAPL/i)).toBeInTheDocument();
        expect(getByText(/10 shares/i)).toBeInTheDocument();
        expect(getByText(/219.86/i)).toBeInTheDocument();
    });
});

test("price label color changes depending on price change", async () => {
    const position = {
        "id": "66a899e3631f435b8dcc2d45",
        "symbol": "AAPL",
        "quantity": 10,
        "buy": 218.24,
        "sell": 0,
        "open": true,
        "openTimestamp": "2024-07-30 03:44:35",
        "closeTimestamp": null
    };

    const gain = {
        "close": "219.86000",
        "previous_close": "218.36000",
    };

    const loss = {
        "close": "217.86000",
        "previous_close": "218.36000",
    };

    const { rerender, container, getByText } = render(<PositionsTile data={position} quoteData={gain}/>);
    await waitFor(() => {
        expect(container.querySelector(".positions-tile-divider")).toBeInTheDocument();
        expect(container.querySelector(".positions-tile-data.green")).toBeInTheDocument();
        expect(getByText(/AAPL/i)).toBeInTheDocument();
        expect(getByText(/10 shares/i)).toBeInTheDocument();
        expect(getByText(/219.86/i)).toBeInTheDocument();
    });

    rerender(<PositionsTile data={position} quoteData={loss}/>);
    await waitFor(() => {
        expect(container.querySelector(".positions-tile-data.red")).toBeInTheDocument();
        expect(getByText(/217.86/i)).toBeInTheDocument();
    });
});

test("useNavigate gets called onClick", async () => {
    const position = {
        "id": "66a899e3631f435b8dcc2d45",
        "symbol": "AAPL",
        "quantity": 10,
        "buy": 218.24,
        "sell": 0,
        "open": true,
        "openTimestamp": "2024-07-30 03:44:35",
        "closeTimestamp": null
    };

    const quote = {
        "close": "219.86000",
        "previous_close": "218.36000",
    };

    const { getByText } = render(<PositionsTile data={position} quoteData={quote}/>);
    fireEvent.click(getByText("AAPL"));
    expect(mockUsedNavigate).toHaveBeenCalledTimes(1);
});