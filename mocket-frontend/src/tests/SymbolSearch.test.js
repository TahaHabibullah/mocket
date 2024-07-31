import React, { act } from "react";
import { render, fireEvent } from '@testing-library/react';
import axios from 'axios';
import SymbolSearch from "../components/SymbolSearch";

jest.mock("axios");

afterEach(() => {
    jest.clearAllMocks()
})

test("search api is called onChange", async () => {
    const mockResponse = {
        "data": [
            {
                "symbol": "AAPL",
                "instrument_name": "Apple Inc",
                "exchange": "NASDAQ",
                "mic_code": "XNGS",
                "exchange_timezone": "America/New_York",
                "instrument_type": "Common Stock",
                "country": "United States",
                "currency": "USD"
            }
        ],
        "status": "ok"
    }

    axios.post.mockResolvedValue(mockResponse);
    const { getByPlaceholderText } = await act( async () => render(<SymbolSearch setResults={() => {}}/>));
    fireEvent.change(getByPlaceholderText("Search"), {target: {value: "something"}});
    expect(axios.post).toHaveBeenCalledTimes(1);
});

test("search api is called onChange multiple times", async () => {
    const mockResponse = {
        "data": [
            {
                "symbol": "AAPL",
                "instrument_name": "Apple Inc",
                "exchange": "NASDAQ",
                "mic_code": "XNGS",
                "exchange_timezone": "America/New_York",
                "instrument_type": "Common Stock",
                "country": "United States",
                "currency": "USD"
            }
        ],
        "status": "ok"
    }

    axios.post.mockResolvedValue(mockResponse);
    const { getByPlaceholderText } = await act( async () => render(<SymbolSearch setResults={() => {}}/>));
    fireEvent.change(getByPlaceholderText("Search"), {target: {value: "something"}});
    fireEvent.change(getByPlaceholderText("Search"), {target: {value: "some"}});
    fireEvent.change(getByPlaceholderText("Search"), {target: {value: "thing"}});
    fireEvent.change(getByPlaceholderText("Search"), {target: {value: "smth"}});
    expect(axios.post).toHaveBeenCalledTimes(4);
});