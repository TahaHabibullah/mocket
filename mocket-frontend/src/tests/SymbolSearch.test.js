import React, { act } from "react";
import { render, fireEvent, screen } from '@testing-library/react';
import axios from 'axios';
import SymbolSearch from "../components/SymbolSearch";

jest.mock("axios");

afterEach(() => {
    jest.clearAllMocks();
});

test("component renders correctly", async () => {
    const { container, getByPlaceholderText } = render(<SymbolSearch setResults={() => {}}/>);
    expect(getByPlaceholderText(/Search/i)).toBeInTheDocument();
    expect(container.querySelector("#search-icon")).toBeInTheDocument();
    expect(container.querySelector("input")).toBeInTheDocument();
}); 

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
    const { getByPlaceholderText } = render(<SymbolSearch setResults={() => {}}/>);
    fireEvent.change(getByPlaceholderText("Search"), {target: {value: "something"}});
    expect(axios.post).toHaveBeenCalledTimes(1);
    const error = screen.queryByText("Error");
    expect(error).toBeNull();
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
    };

    axios.post.mockResolvedValue(mockResponse);
    const { getByPlaceholderText } = render(<SymbolSearch setResults={() => {}}/>);
    fireEvent.change(getByPlaceholderText("Search"), {target: {value: "something"}});
    fireEvent.change(getByPlaceholderText("Search"), {target: {value: "some"}});
    fireEvent.change(getByPlaceholderText("Search"), {target: {value: "thing"}});
    fireEvent.change(getByPlaceholderText("Search"), {target: {value: "smth"}});
    expect(axios.post).toHaveBeenCalledTimes(4);
    const error = screen.queryByText("Error");
    expect(error).toBeNull();
});


test("alert shown upon post request failure", async () => {
    axios.post.mockRejectedValue(new Error("error"));
    const { getByPlaceholderText, getByText } = render(<SymbolSearch setResults={() => {}}/>);
    await act(() => fireEvent.change(getByPlaceholderText("Search"), {target: {value: "something"}}));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(getByText(/Error/i)).toBeInTheDocument();
});

test("alert shown when api returns error", async () => {
    const mockResponse = {
        "status": "error"
    };

    axios.post.mockResolvedValue(mockResponse);
    const { getByPlaceholderText, getByText } = render(<SymbolSearch setResults={() => {}}/>);
    await act(() => fireEvent.change(getByPlaceholderText("Search"), {target: {value: "something"}}));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(getByText(/Error/i)).toBeInTheDocument();
});