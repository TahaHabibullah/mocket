import React from "react";
import { render } from '@testing-library/react';
import Footer from "../components/Footer.js";

test("component renders correctly", async () => {
    const { container, getByText } = render(<Footer/>);
    expect(getByText(/Copyright/i)).toBeInTheDocument();
    expect(getByText(/Mocket/i)).toBeInTheDocument();
    expect(getByText(/Privacy Policy/i)).toBeInTheDocument();
});