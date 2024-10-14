import React, { act } from "react";
import { render, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Login from "../components/Login.js"

jest.mock('axios');

afterEach(() => {
    jest.clearAllMocks();
});
const mockUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
   ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));

test("component renders correctly", async () => {
    const { container, getByPlaceholderText, getByText } = render(<Login/>);
    expect(getByPlaceholderText("Email")).toBeInTheDocument();
    expect(getByPlaceholderText("Password")).toBeInTheDocument();
    expect(getByText("Login")).toBeInTheDocument();
    expect(container.querySelector(".mocket-login-header")).toBeInTheDocument();
    expect(container.querySelector(".mocket-login-newuser")).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledTimes(0);
});

test("calls authentication on valid input", async () => {
    const mockResponse = {
        "status": "success"
    }
    axios.post.mockResolvedValue({ data: mockResponse });
    const { getByPlaceholderText, getByText } = render(<Login/>);
    fireEvent.change(getByPlaceholderText("Email"), {target: {value: "test@test.com"}});
    fireEvent.change(getByPlaceholderText("Password"), {target: {value: "test"}});
    fireEvent.click(getByText("Login"));
    expect(axios.post).toHaveBeenCalledTimes(1);
});

test("does not call authentication on invalid input, alert shown", async () => {
    const { getByPlaceholderText, getByText } = render(<Login/>);
    fireEvent.change(getByPlaceholderText("Email"), {target: {value: ""}});
    fireEvent.change(getByPlaceholderText("Password"), {target: {value: ""}});
    await act(() => fireEvent.click(getByText("Login")));
    expect(getByText(/Please fill in the email field./i)).toBeInTheDocument();
    fireEvent.change(getByPlaceholderText("Email"), {target: {value: "test"}});
    fireEvent.change(getByPlaceholderText("Password"), {target: {value: ""}});
    await act(() => fireEvent.click(getByText("Login")));
    expect(getByText(/Please fill in the password field./i)).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledTimes(0);
});

test("alert shown when login fails", async () => {
    axios.post.mockRejectedValue({ response: { data: "Failed to login." } });
    const { getByPlaceholderText, getByText } = render(<Login/>);
    fireEvent.change(getByPlaceholderText("Email"), {target: {value: "test@test.com"}});
    fireEvent.change(getByPlaceholderText("Password"), {target: {value: "test"}});
    await act(() => fireEvent.click(getByText("Login")));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(getByText(/Failed to login./i)).toBeInTheDocument();
});