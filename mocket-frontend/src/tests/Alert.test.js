import React from "react";
import { render, fireEvent } from '@testing-library/react';
import Alert from "../components/Alert.js";

test("component renders correctly", async () => {
    const { container, getByText } = render(<Alert message="Unexpected failure." style="error" setError={() => {}}/>);
    expect(container.querySelector(".alert-error")).toBeInTheDocument();
    expect(container.querySelector(".alert-dismiss")).toBeInTheDocument();
    expect(getByText(/Error/i)).toBeInTheDocument();
    expect(getByText(/Unexpected failure./i)).toBeInTheDocument();
});

test("pressing the x dismisses alert", async () => {
    const foo = jest.fn();
    const { getByText } = render(<Alert message="Unexpected failure." style="error" setError={foo}/>);
    fireEvent.click(getByText("×"));
    expect(foo).toHaveBeenCalledTimes(1);
});