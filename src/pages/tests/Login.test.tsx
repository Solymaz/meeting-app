import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import server from "../../mocks/server";
import AuthContextWrapper from "./helpers";

describe("errors are shown when any of the form inputs is invalid", () => {
  let email: HTMLElement;
  let password: HTMLElement;
  let loginButton: HTMLElement;

  beforeEach(async () => {
    render(<Login />, { wrapper: AuthContextWrapper });
    email = screen.getByRole("textbox", { name: /email address/i });
    password = screen.getByLabelText("Password");
    loginButton = screen.getByRole("button", { name: "Login" });
  });

  test("error is shown when email is not provided", async () => {
    userEvent.type(password, "Test!123");
    userEvent.click(loginButton);

    await waitFor(async () => {
      const emailIsRequiredError = await screen.findByText(
        /email is required/i
      );
      expect(emailIsRequiredError).toBeInTheDocument();
    });
  });

  test("error is shown when email is not valid", async () => {
    userEvent.type(email, "solmaz.com");
    userEvent.type(password, "Test!123");
    userEvent.click(loginButton);

    await waitFor(async () => {
      const emailIsInvalidError = await screen.findByText(/email is invalid/i);

      expect(emailIsInvalidError).toBeInTheDocument();
    });
  });

  test("error is shown when password is not provided", async () => {
    userEvent.type(email, "solmaz@test.com");
    userEvent.click(loginButton);

    await waitFor(async () => {
      const passwordIsRequiredError = await screen.findByText(
        /password is required/i
      );
      expect(passwordIsRequiredError).toBeInTheDocument();
    });
  });

  test("error is shown when password is not 8 characters", async () => {
    userEvent.type(email, "solmaz@test.com");
    userEvent.type(password, "Test!12");
    userEvent.click(loginButton);

    await waitFor(async () => {
      const passwordIsInvalidError = await screen.findByText(
        /password must be at least 8 characters/i
      );
      expect(passwordIsInvalidError).toBeInTheDocument();
    });
  });

  test("error is shown when password is missing at least one capital letter", async () => {
    userEvent.type(email, "solmaz@test.com");
    userEvent.type(password, "test!123");
    userEvent.click(loginButton);

    await waitFor(async () => {
      const passwordIsInvalidError = await screen.findByText(
        /password must contain at least 1 uppercase letter/i
      );
      expect(passwordIsInvalidError).toBeInTheDocument();
    });
  });

  test("error is shown when password is missing at least one number", async () => {
    userEvent.type(email, "solmaz@test.com");
    userEvent.type(password, "Testing!");
    userEvent.click(loginButton);

    await waitFor(async () => {
      const passwordIsInvalidError = await screen.findByText(
        /password must contain at least 1 number/i
      );
      expect(passwordIsInvalidError).toBeInTheDocument();
    });
  });

  test("error is shown when password is missing at least one symbol", async () => {
    userEvent.type(email, "solmaz@test.com");
    userEvent.type(password, "Test1234");
    userEvent.click(loginButton);

    await waitFor(async () => {
      const passwordIsInvalidError = await screen.findByText(
        /password must contain at least 1 symbol/i
      );
      expect(passwordIsInvalidError).toBeInTheDocument();
    });
  });

  test("error is shown when user cannot login", async () => {
    server.resetHandlers(
      rest.post(
        `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/auth/login`,
        (req, res, ctx) =>
          res(
            ctx.status(400),
            ctx.json({
              message: "User is not logged in",
            })
          )
      )
    );
    userEvent.type(email, "solmaz@test.com");
    userEvent.type(password, "Test!1234");
    userEvent.click(loginButton);

    // Loading state should be shown
    const loginButtonEl = await screen.findByRole("button", {
      name: "Logging in...",
    });
    expect(loginButtonEl).toBeInTheDocument();

    // Error message should be shown
    const errorMsg = await screen.findByText("User is not logged in");
    expect(errorMsg).toBeInTheDocument();
  });
});
