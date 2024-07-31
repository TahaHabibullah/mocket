import React from "react";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SymbolResultsItem from "../components/SymbolResultsItem.js";

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


test("component props displayed correctly", async () => {
    render(<SymbolResultsItem name="Apple Inc" symbol="AAPL"/>);
    const nameElement = await waitFor(() => screen.getByText(/Apple Inc/i));
    const symbolElement = await waitFor(() => screen.getByText(/AAPL/i));
    expect(nameElement).toBeInTheDocument();
    expect(symbolElement).toBeInTheDocument();
});

test("name prop gets truncated", async () => {
    render(<SymbolResultsItem name="Advanced Microsystems" symbol="AMD"/>);
    const nameElement = await waitFor(() => screen.getByText(/Advanced Microsy.../i));
    const symbolElement = await waitFor(() => screen.getByText(/AMD/i));
    expect(nameElement).toBeInTheDocument();
    expect(symbolElement).toBeInTheDocument();
});

test("handleRedirect gets called onClick", async () => {
    const { getByText } = render(<SymbolResultsItem name="Apple Inc" symbol="AAPL"/>);
    fireEvent.click(getByText("AAPL"));
    expect(mockUsedNavigate).toHaveBeenCalledTimes(1);
});