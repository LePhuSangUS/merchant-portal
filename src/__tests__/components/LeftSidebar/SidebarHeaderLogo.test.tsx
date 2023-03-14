import React from "react";
import { render, screen } from "@testing-library/react"
// import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import SidebarHeaderLogo from "@/components/LeftSidebar/SidebarHeader/SidebarHeaderLogo";
import { logoPurpleHorizontal } from "@/assets";

test('loads and displays logo', async () => {
  const logo = <img src={logoPurpleHorizontal} alt="logo" />
  // ARRANGE
  render(<SidebarHeaderLogo logo={logo} />)

  expect(screen.getByRole('img')).toHaveAttribute('src', logoPurpleHorizontal)
})