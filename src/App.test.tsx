import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("user will be redirected to login view when successfully registered", async () => {
  render(<App />);
  const registrationLink = screen.getByRole("link", {
    name: "Create an account",
  });

  userEvent.click(registrationLink);

  const name = screen.getByRole("textbox", { name: "Name" });
  const email = screen.getByRole("textbox", { name: /email address/i });
  const password = screen.getByLabelText("Password");
  const confirmPassword = screen.getByLabelText("Confirm Password");
  const submitButton = screen.getByRole("button", { name: "Register" });

  userEvent.type(name, "Solmaz");
  userEvent.type(email, "solmaz@test.com");
  userEvent.type(password, "Test!123");
  userEvent.type(confirmPassword, "Test!123");
  userEvent.click(submitButton);

  const calendarHeading = await screen.findByRole("heading", {
    name: "Login",
  });
  expect(calendarHeading).toBeInTheDocument();
});

test("user will be redirected to calender view when successfully logged in", async () => {
  render(<App />);
  const email = screen.getByRole("textbox", { name: /email address/i });
  const password = screen.getByLabelText("Password");
  const loginButton = screen.getByRole("button", { name: "Login" });

  userEvent.type(email, "solmaz@test.com");
  userEvent.type(password, "Testing!12");
  userEvent.click(loginButton);

  const calendarHeading = await screen.findByRole("heading", {
    name: "Calendar",
  });
  expect(calendarHeading).toBeInTheDocument();
});
