import React, { act } from "react";
import { render, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Register from "../components/Register.js"

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
    const { container, getByPlaceholderText } = render(<Register/>);
    expect(getByPlaceholderText("Email")).toBeInTheDocument();
    expect(getByPlaceholderText("Password")).toBeInTheDocument();
    expect(getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(container.querySelector(".mocket-register-button")).toBeInTheDocument();
    expect(container.querySelector(".mocket-register-header")).toBeInTheDocument();
    expect(container.querySelector(".mocket-register-existing")).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledTimes(0);
});

test("calls register service on valid input", async () => {
    const mockResponse = {
        "status": "success"
    }
    axios.post.mockResolvedValue({ data: mockResponse });
    const { container, getByPlaceholderText } = render(<Register/>);
    fireEvent.change(getByPlaceholderText("Email"), {target: {value: "test@test.com"}});
    fireEvent.change(getByPlaceholderText("Password"), {target: {value: "test"}});
    fireEvent.change(getByPlaceholderText("Confirm Password"), {target: {value: "test"}});
    fireEvent.click(container.querySelector(".mocket-register-button"));
    expect(axios.post).toHaveBeenCalledTimes(1);
});

test("does not call register service on invalid input, alert shown", async () => {
    const { container, getByPlaceholderText, getByText } = render(<Register/>);
    fireEvent.change(getByPlaceholderText("Email"), {target: {value: ""}});
    fireEvent.change(getByPlaceholderText("Password"), {target: {value: ""}});
    fireEvent.change(getByPlaceholderText("Confirm Password"), {target: {value: ""}});
    await act(() => fireEvent.click(container.querySelector(".mocket-register-button")));
    expect(getByText(/Please fill in the email field./i)).toBeInTheDocument();
    fireEvent.change(getByPlaceholderText("Email"), {target: {value: "test"}});
    fireEvent.change(getByPlaceholderText("Password"), {target: {value: ""}});
    fireEvent.change(getByPlaceholderText("Confirm Password"), {target: {value: ""}});
    await act(() => fireEvent.click(container.querySelector(".mocket-register-button")));
    expect(getByText(/Please enter a valid email./i)).toBeInTheDocument();
    fireEvent.change(getByPlaceholderText("Email"), {target: {value: "test@test.com"}});
    fireEvent.change(getByPlaceholderText("Password"), {target: {value: ""}});
    fireEvent.change(getByPlaceholderText("Confirm Password"), {target: {value: ""}});
    await act(() => fireEvent.click(container.querySelector(".mocket-register-button")));
    expect(getByText(/Please fill in the password field./i)).toBeInTheDocument();
    fireEvent.change(getByPlaceholderText("Email"), {target: {value: "test@test.com"}});
    fireEvent.change(getByPlaceholderText("Password"), {target: {value: "test"}});
    fireEvent.change(getByPlaceholderText("Confirm Password"), {target: {value: ""}});
    await act(() => fireEvent.click(container.querySelector(".mocket-register-button")));
    expect(getByText(/Passwords do not match./i)).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledTimes(0);
});

test("alert shown when register fails", async () => {
    axios.post.mockRejectedValue(new Error("error"));
    const { container, getByPlaceholderText, getByText } = render(<Register/>);
    fireEvent.change(getByPlaceholderText("Email"), {target: {value: "test@test.com"}});
    fireEvent.change(getByPlaceholderText("Password"), {target: {value: "test"}});
    fireEvent.change(getByPlaceholderText("Confirm Password"), {target: {value: "test"}});
    await act(() => fireEvent.click(container.querySelector(".mocket-register-button")));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(getByText(/Failed to register./i)).toBeInTheDocument();
});