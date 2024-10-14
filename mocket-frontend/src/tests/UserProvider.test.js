import React, { act } from "react";
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import '@testing-library/jest-dom';
import { UserProvider } from "../components/UserProvider";
import * as Utils from "../components/Utils";

jest.mock('axios');

afterEach(() => {
    jest.clearAllMocks();
});

beforeEach(() => {
    axios.defaults = {
        headers: {
          common: {}
        }
      };
    axios.defaults.headers.common['Authorization'] = "test";

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
        return "test";
    });

    jest.spyOn(Utils, 'getUserId').mockImplementation(() => "test");
});

test("fetches user data", async () => {
    const mockResponse = {
        "id": "66a8957e631f435b8dcc2d43",
        "email": "test3@test.com",
        "balance": 20000.0,
        "positions": [
            {
                "id": "66a899e3631f435b8dcc2d45",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 218.24,
                "sell": 218.24,
                "open": false,
                "openTimestamp": "2024-07-30 03:44:35",
                "closeTimestamp": "2024-07-30 03:45:03"
            }
        ]
    }
    axios.get.mockResolvedValue({ data: mockResponse });
    await act( async () => render(<UserProvider/>));
    expect(axios.get).toHaveBeenCalledTimes(1);
    const error = screen.queryByText("Error");
    expect(error).toBeNull();
});

test("alert shown upon failure", async () => {
    axios.get.mockRejectedValue(new Error("error"));
    const { getByText } = await act( async () => render(<UserProvider/>));
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(getByText(/Error/i)).toBeInTheDocument();
});