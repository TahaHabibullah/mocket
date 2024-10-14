import React, { act } from "react";
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ResetPassword from "../components/ResetPassword.js"

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
    const mockResponse = {
        "status": "success"
    }
    axios.post.mockResolvedValue({ data: mockResponse });
    const { container, getByPlaceholderText } = await act( async () => render(<ResetPassword/>));
    expect(getByPlaceholderText("New Password")).toBeInTheDocument();
    expect(getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(container.querySelector(".mocket-reset-button")).toBeInTheDocument();
    expect(container.querySelector(".mocket-reset-header")).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledTimes(1);
});

test("calls reset password service on valid input", async () => {
    const mockResponse = {
        "status": "success"
    }
    axios.post.mockResolvedValue({ data: mockResponse });
    axios.put.mockResolvedValue({ data: mockResponse });
    const { container, getByPlaceholderText } = await act( async () => render(<ResetPassword/>));
    fireEvent.change(getByPlaceholderText("New Password"), {target: {value: "testing1"}});
    fireEvent.change(getByPlaceholderText("Confirm Password"), {target: {value: "testing1"}});
    fireEvent.click(container.querySelector(".mocket-reset-button"));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledTimes(1);
});

test("does not call reset password service on invalid input, alert shown", async () => {
    const mockResponse = {
        "status": "success"
    }
    axios.post.mockResolvedValue({ data: mockResponse });
    const { container, getByPlaceholderText, getByText } = await act( async () => render(<ResetPassword/>));
    fireEvent.change(getByPlaceholderText("New Password"), {target: {value: ""}});
    fireEvent.change(getByPlaceholderText("Confirm Password"), {target: {value: ""}});
    await act(() => fireEvent.click(container.querySelector(".mocket-reset-button")));
    expect(getByText(/Please fill in the password field./i)).toBeInTheDocument();
    fireEvent.change(getByPlaceholderText("New Password"), {target: {value: "test"}});
    fireEvent.change(getByPlaceholderText("Confirm Password"), {target: {value: ""}});
    await act(() => fireEvent.click(container.querySelector(".mocket-reset-button")));
    expect(getByText(/Password must be 8-30 characters long./i)).toBeInTheDocument();
    fireEvent.change(getByPlaceholderText("New Password"), {target: {value: "testing1"}});
    fireEvent.change(getByPlaceholderText("Confirm Password"), {target: {value: "testing2"}});
    await act(() => fireEvent.click(container.querySelector(".mocket-reset-button")));
    expect(getByText(/Passwords do not match./i)).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledTimes(1);
});

test("alert shown when reset password service fails", async () => {
    const mockResponse = {
        "status": "success"
    }
    axios.post.mockResolvedValue({ data: mockResponse });
    axios.put.mockRejectedValue({ response: { data: "Password reset failed." } });
    const { container, getByPlaceholderText, getByText } = await act( async () => render(<ResetPassword/>));
    fireEvent.change(getByPlaceholderText("New Password"), {target: {value: "testing1"}});
    fireEvent.change(getByPlaceholderText("Confirm Password"), {target: {value: "testing1"}});
    await act( async () => fireEvent.click(container.querySelector(".mocket-reset-button")));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(getByText(/Password reset failed./i)).toBeInTheDocument();
});