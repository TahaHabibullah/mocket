import React from "react";
import { render, fireEvent, waitFor } from '@testing-library/react';
import MocketNavBar from "../components/MocketNavBar.js";
import axios from 'axios';

jest.mock("axios");

afterEach(() => {
    jest.clearAllMocks();
});

const mockUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
   ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));

test("nav bar and symbol search render correctly", async () => {
    const { container, getByPlaceholderText } = render(<MocketNavBar/>);
    expect(getByPlaceholderText(/Search/i)).toBeInTheDocument();
    expect(container.querySelector(".nav-bar-brand")).toBeInTheDocument();
    expect(container.querySelector(".nav-bar-repo")).toBeInTheDocument();
    expect(container.querySelector("#search-icon")).toBeInTheDocument();
});

test("fetch from symbol search causes results list to display", async () => {
    const mockResponse = {
        "data": {
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
    };

    axios.post.mockResolvedValue(mockResponse);
    const { container, getByPlaceholderText, getByText } = render(<MocketNavBar/>);
    expect(container.querySelector(".results-list")).toBeNull();
    await waitFor(() => fireEvent.change(getByPlaceholderText("Search"), {target: {value: "something"}}));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(container.querySelector(".results-list")).toBeInTheDocument();
    expect(getByText(/AAPL/i)).toBeInTheDocument();
    expect(getByText(/Apple Inc/i)).toBeInTheDocument();
});