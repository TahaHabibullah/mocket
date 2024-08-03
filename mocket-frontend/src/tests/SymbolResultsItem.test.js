import React from "react";
import { render, fireEvent } from '@testing-library/react';
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


test("component renders correctly", async () => {
    const { getByText } = render(<SymbolResultsItem name="Apple Inc" symbol="AAPL"/>);
    expect(getByText(/Apple Inc/i)).toBeInTheDocument();
    expect(getByText(/AAPL/i)).toBeInTheDocument();
});

test("name prop gets truncated", async () => {
    const { getByText } = render(<SymbolResultsItem name="Advanced Microsystems" symbol="AMD"/>);
    expect(getByText(/Advanced Microsy.../i)).toBeInTheDocument();
    expect(getByText(/AMD/i)).toBeInTheDocument();
});

test("handleRedirect gets called onClick", async () => {
    const { getByText } = render(<SymbolResultsItem name="Apple Inc" symbol="AAPL"/>);
    fireEvent.click(getByText("AAPL"));
    expect(mockUsedNavigate).toHaveBeenCalledTimes(1);
});