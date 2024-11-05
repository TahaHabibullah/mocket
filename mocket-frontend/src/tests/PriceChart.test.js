import React, { act } from "react";
import { render, waitFor, fireEvent } from '@testing-library/react';
import PriceChart from "../components/PriceChart.js";
import { useParams } from "react-router-dom";
import axios from "axios";

jest.mock("axios");
jest.mock("react-chartjs-2", () => ({
    Line: () => null
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
   useParams: jest.fn()
 }));

afterEach(() => {
    jest.clearAllMocks();
});

test("component renders correctly", async () => {
    useParams.mockReturnValue({ symbol: "AAPL" });

    const mockResponse = {
        "values": [
            {
                "datetime": "2024-08-02 15:45:00",
                "open": "222.02000",
                "high": "222.24001",
                "low": "221.17000",
                "close": "221.17999",
                "volume": "1185525"
            },
            {
                "datetime": "2024-08-02 15:50:00",
                "open": "221.14000",
                "high": "221.25999",
                "low": "219.31500",
                "close": "219.84000",
                "volume": "2620212"
            },
            {
                "datetime": "2024-08-02 15:55:00",
                "open": "219.85001",
                "high": "219.95000",
                "low": "219.06000",
                "close": "219.80000",
                "volume": "4200530"
            }
        ],
        "status": "ok"
    };

    const quote = {
        "symbol": "AAPL",
        "name": "Apple Inc",
        "close": "217.96001",
        "previous_close": "217.49001",
    }

    axios.post.mockResolvedValue({ data: mockResponse });
    const { container, getByText } = await act(async () => render(<PriceChart liveData={217.96} quoteData={quote}/>));

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(getByText(/Apple Inc/i)).toBeInTheDocument();
        expect(getByText(/217.96/i)).toBeInTheDocument();
        expect(getByText(/0.22%/i)).toBeInTheDocument();
        expect(getByText(/1Y/i)).toBeInTheDocument();
        expect(container.querySelector(".price-chart")).toBeInTheDocument();
        expect(container.querySelector(".price-chart-divider")).toBeInTheDocument();
        expect(container.querySelector(".price-chart-interval")).toBeInTheDocument();
        expect(container.querySelector(".quote-header-diff-green")).toBeInTheDocument();
    });
});

test("alert shown when fetch fails, only chart itself effected", async () => {
    useParams.mockReturnValue({ symbol: "AAPL" });

    const quote = {
        "symbol": "AAPL",
        "name": "Apple Inc",
        "close": "217.96001",
        "previous_close": "217.49001",
    }

    axios.post.mockRejectedValue(new Error("error"));
    const { container, getByText } = await act(async () => render(<PriceChart liveData={217.96} quoteData={quote}/>));

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(getByText(/Failed to fetch data from API./i)).toBeInTheDocument();
        expect(getByText(/Apple Inc/i)).toBeInTheDocument();
        expect(getByText(/217.96/i)).toBeInTheDocument();
        expect(getByText(/0.22%/i)).toBeInTheDocument();
        expect(getByText(/1Y/i)).toBeInTheDocument();
        expect(container.querySelector(".price-chart")).toBeInTheDocument();
        expect(container.querySelector(".price-chart-divider")).toBeInTheDocument();
        expect(container.querySelector(".price-chart-interval")).toBeInTheDocument();
        expect(container.querySelector(".quote-header-diff-green")).toBeInTheDocument();
    });
});

test("alert shown when fetch returns empty, only chart itself effected", async () => {
    useParams.mockReturnValue({ symbol: "AAPL" });

    const mockResponse = {
        "status": "error"
    };

    const quote = {
        "symbol": "AAPL",
        "name": "Apple Inc",
        "close": "217.96001",
        "previous_close": "217.49001",
    }

    axios.post.mockResolvedValue({ data: mockResponse });
    const { container, getByText } = await act(async () => render(<PriceChart liveData={217.96} quoteData={quote}/>));

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(getByText(/API limit exceeded. Try again later./i)).toBeInTheDocument();
        expect(getByText(/Apple Inc/i)).toBeInTheDocument();
        expect(getByText(/217.96/i)).toBeInTheDocument();
        expect(getByText(/0.22%/i)).toBeInTheDocument();
        expect(getByText(/1Y/i)).toBeInTheDocument();
        expect(container.querySelector(".price-chart")).toBeInTheDocument();
        expect(container.querySelector(".price-chart-divider")).toBeInTheDocument();
        expect(container.querySelector(".price-chart-interval")).toBeInTheDocument();
        expect(container.querySelector(".quote-header-diff-green")).toBeInTheDocument();
    });
});

test("price diff changes color depending on gain/loss", async () => {
    useParams.mockReturnValue({ symbol: "AAPL" });

    const mockResponse = {
        "values": [
            {
                "datetime": "2024-08-02 15:45:00",
                "open": "222.02000",
                "high": "222.24001",
                "low": "221.17000",
                "close": "221.17999",
                "volume": "1185525"
            },
            {
                "datetime": "2024-08-02 15:50:00",
                "open": "221.14000",
                "high": "221.25999",
                "low": "219.31500",
                "close": "219.84000",
                "volume": "2620212"
            },
            {
                "datetime": "2024-08-02 15:55:00",
                "open": "219.85001",
                "high": "219.95000",
                "low": "219.06000",
                "close": "219.80000",
                "volume": "4200530"
            }
        ],
        "status": "ok"
    };

    const quote = {
        "close": "217.96001",
        "previous_close": "217.49001",
    }

    axios.post.mockResolvedValue({ data: mockResponse });
    var { unmount, container, getByText } = render(<PriceChart liveData={217.96} quoteData={quote}/>);
    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(getByText(/0.22%/i)).toBeInTheDocument();
        expect(container.querySelector(".quote-header-diff-green")).toBeInTheDocument();
        expect(container.querySelector(".quote-header-diff-red")).toBeNull();
    });

    unmount();
    var { container, getByText } = render(<PriceChart liveData={216.96} quoteData={quote}/>);
    await waitFor(() => {
        expect(getByText(/0.24%/i)).toBeInTheDocument();
        expect(container.querySelector(".quote-header-diff-red")).toBeInTheDocument();
        expect(container.querySelector(".quote-header-diff-green")).toBeNull();
    });
});

test("pressing interval buttons call api", async () => {
    useParams.mockReturnValue({ symbol: "AAPL" });

    const mockResponse = {
        "values": [
            {
                "datetime": "2024-08-02 15:55:00",
                "open": "219.85001",
                "high": "219.95000",
                "low": "219.06000",
                "close": "219.80000",
                "volume": "4200530"
            }
        ],
        "status": "ok"
    };

    const quote = {
        "symbol": "AAPL",
        "name": "Apple Inc",
        "close": "217.96001",
        "previous_close": "217.49001",
    }

    axios.post.mockResolvedValue({ data: [mockResponse] });
    const { getByText } = await act(async () => render(<PriceChart liveData={217.96} quoteData={quote}/>));

    await waitFor(() => fireEvent.click(getByText("1W")));
    await waitFor(() => fireEvent.click(getByText("1M")));
    await waitFor(() => fireEvent.click(getByText("1Y")));
    expect(axios.post).toHaveBeenCalledTimes(4);
});