import React from "react";
import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MenuIcon } from "@/components/Layout";

test('loads menu icon', async () => {
    // ARRANGE
    render(<MenuIcon id="report" />);

    screen.getAllByRole('img').map(item => {
        expect(item).toHaveProperty('src');
    })

    // expect(screen.getAllByRole('img')).toHaveProperty('src');
})