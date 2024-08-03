import React from "react";
import { render } from '@testing-library/react';
import QuoteDataTile from "../components/QuoteDataTile.js";

test("component renders correctly", async () => {
    const { container, getByText } = render(<QuoteDataTile title="Volume" data={2345}/>);
    expect(getByText(/2345/i)).toBeInTheDocument();
    expect(getByText(/Volume/i)).toBeInTheDocument();
    expect(container.querySelector(".quote-tile")).toBeInTheDocument();
});

test("still renders when data is null", async () => {
    const { container, getByText } = render(<QuoteDataTile title="Volume" data={null}/>);
    expect(getByText(/Volume/i)).toBeInTheDocument();
    expect(container.querySelector(".quote-tile")).toBeInTheDocument();
});