import React from "react";
import { render } from '@testing-library/react';
import SymbolResultsList from "../components/SymbolResultsList.js";

const mockUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
   ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));

const reload = window.location.reload;

beforeAll(() => {
  Object.defineProperty(window, "location", {
    value: { reload: jest.fn() }
  });
});

afterAll(() => {
  window.location.reload = reload;
});

test("component renders correctly", async () => {
    const list = {
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
            },
            {
                "symbol": "NVDA",
                "instrument_name": "NVIDIA Corp",
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
    const { getByText } = render(<SymbolResultsList results={list}/>);
    expect(getByText(/Apple Inc/i)).toBeInTheDocument();
    expect(getByText(/AAPL/i)).toBeInTheDocument();
    expect(getByText(/NVIDIA Corp/i)).toBeInTheDocument();
    expect(getByText(/NVDA/i)).toBeInTheDocument();
});