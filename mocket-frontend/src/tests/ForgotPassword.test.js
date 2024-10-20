import React, { act } from "react";
import { render, fireEvent } from '@testing-library/react';
import axios from 'axios';
import ForgotPassword from "../components/ForgotPassword.js"

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
    const { container, getByPlaceholderText } = render(<ForgotPassword/>);
    expect(getByPlaceholderText("Enter your email here")).toBeInTheDocument();
    expect(container.querySelector(".mocket-login-button")).toBeInTheDocument();
    expect(container.querySelector(".mocket-forgot-header")).toBeInTheDocument();
    expect(container.querySelector(".mocket-forgot-remembered")).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledTimes(0);
});

test("calls forgotten password service on valid input", async () => {
    const mockResponse = {
        "status": "success"
    }
    axios.post.mockResolvedValue({ data: mockResponse });
    const { container, getByPlaceholderText } = render(<ForgotPassword/>);
    fireEvent.change(getByPlaceholderText("Enter your email here"), {target: {value: "test@test.com"}});
    fireEvent.click(container.querySelector(".mocket-login-button"));
    expect(axios.post).toHaveBeenCalledTimes(1);
});

test("does not call forgotten password service on invalid input, alert shown", async () => {
    const { container, getByPlaceholderText, getByText } = render(<ForgotPassword/>);
    fireEvent.change(getByPlaceholderText("Enter your email here"), {target: {value: ""}});
    await act(() => fireEvent.click(container.querySelector(".mocket-login-button")));
    expect(getByText(/Please fill in the email field./i)).toBeInTheDocument();
    fireEvent.change(getByPlaceholderText("Enter your email here"), {target: {value: "test"}});
    await act(() => fireEvent.click(container.querySelector(".mocket-login-button")));
    expect(getByText(/Please enter a valid email./i)).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledTimes(0);
});

test("alert shown when forgotten password service fails", async () => {
    axios.post.mockRejectedValue({ response: { data: "Couldn't send reset email." } });
    const { container, getByPlaceholderText, getByText } = render(<ForgotPassword/>);
    fireEvent.change(getByPlaceholderText("Enter your email here"), {target: {value: "test@test.com"}});
    await act(() => fireEvent.click(container.querySelector(".mocket-login-button")));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(getByText(/Couldn't send reset email./i)).toBeInTheDocument();
});