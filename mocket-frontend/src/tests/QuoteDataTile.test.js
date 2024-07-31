import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import QuoteDataTile from "../components/QuoteDataTile.js";

test("component props displayed correctly", async () => {
    render(<QuoteDataTile title="Volume" data={2345}/>);
    const dataElement = await waitFor(() => screen.getByText(/2345/i));
    const titleElement = await waitFor(() => screen.getByText(/Volume/i));
    expect(dataElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
});