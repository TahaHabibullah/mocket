import React from "react";
import { render } from '@testing-library/react';
import QuoteHeader from "../components/QuoteHeader.js";

test("component renders correctly", async () => {
    const quote = {
        "symbol": "AAPL",
        "name": "Apple Inc",
    };

    const { getByText } = render(<QuoteHeader name={"Apple Inc"} symbol={"AAPL"} live={217.96} tooltipActive={false}/>);
        expect(getByText(/Apple Inc/i)).toBeInTheDocument();
        expect(getByText(/AAPL/i)).toBeInTheDocument();
        expect(getByText(/217.96/i)).toBeInTheDocument();
});