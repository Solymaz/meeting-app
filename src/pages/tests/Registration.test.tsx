import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import userEvent from "@testing-library/user-event";
import Registration from "../Registration";
import server from "../../mocks/server";
import AuthContextWrapper from "./helpers";

describe("errors are shown when any of the form inputs is invalid", () => {
  let name: HTMLElement;
  let email: HTMLElement;
  let password: HTMLElement;
  let confirmPassword: HTMLElement;
  let submitButton: HTMLElement;

  beforeEach(async () => {
    render(<Registration />, { wrapper: AuthContextWrapper });
    name = screen.getByRole("textbox", { name: "Name" });
    email = screen.getByRole("textbox", { name: /email address/i });
    password = screen.getByLabelText("Password");
    confirmPassword = screen.getByLabelText("Confirm Password");
    submitButton = screen.getByRole("button", { name: "Register" });
  });

  test("error is shown when name is not provided", async () => {
    userEvent.type(email, "solmaz@test.com");
    userEvent.type(password, "Test!123");
    userEvent.type(confirmPassword, "Test!123");
    userEvent.click(submitButton);

    await waitFor(async () => {
      const nameIsRequiredError = await screen.findByText(/name is required/i);
      expect(nameIsRequiredError).toBeInTheDocument();
    });
  });

  test("error is shown when email is not provided", async () => {
    userEvent.type(name, "Solmaz");
    userEvent.type(password, "Test!123");
    userEvent.type(confirmPassword, "Test!123");
    userEvent.click(submitButton);

    await waitFor(async () => {
      const emailIsRequiredError = await screen.findByText(
        /email is required/i
      );

      expect(emailIsRequiredError).toBeInTheDocument();
    });
  });

  test("error is shown when email is not valid", async () => {
    userEvent.type(name, "Solmaz");
    userEvent.type(email, "solmaz.com");
    userEvent.type(password, "Test!123");
    userEvent.type(confirmPassword, "Test!123");
    userEvent.click(submitButton);

    await waitFor(async () => {
      const emailIsInvalidError = await screen.findByText(/email is invalid/i);

      expect(emailIsInvalidError).toBeInTheDocument();
    });
  });

  test("error is shown when password is not provided", async () => {
    userEvent.type(name, "Solmaz");
    userEvent.type(email, "solmaz@test.com");
    userEvent.type(confirmPassword, "Test!123");
    userEvent.click(submitButton);

    await waitFor(async () => {
      const passwordIsRequiredError = await screen.findByText(
        /password is required/i
      );
      expect(passwordIsRequiredError).toBeInTheDocument();
    });
  });

  test("error is shown when password is not 8 characters", async () => {
    userEvent.type(name, "Solmaz");
    userEvent.type(email, "solmaz@test.com");
    userEvent.type(password, "Test!12");
    userEvent.type(confirmPassword, "Test!12");
    userEvent.click(submitButton);

    await waitFor(async () => {
      const passwordIsInvalidError = await screen.findByText(
        /password must be at least 8 characters/i
      );
      expect(passwordIsInvalidError).toBeInTheDocument();
    });
  });

  test("error is shown when password is missing at least one capital letter", async () => {
    userEvent.type(name, "Solmaz");
    userEvent.type(email, "solmaz@test.com");
    userEvent.type(password, "test!123");
    userEvent.type(confirmPassword, "test!123");
    userEvent.click(submitButton);

    await waitFor(async () => {
      const passwordIsInvalidError = await screen.findByText(
        /password must contain at least 1 uppercase letter/i
      );
      expect(passwordIsInvalidError).toBeInTheDocument();
    });
  });

  test("error is shown when password is missing at least one number", async () => {
    userEvent.type(name, "Solmaz");
    userEvent.type(email, "solmaz@test.com");
    userEvent.type(password, "Testing!");
    userEvent.type(confirmPassword, "Testing!");
    userEvent.click(submitButton);

    await waitFor(async () => {
      const passwordIsInvalidError = await screen.findByText(
        /password must contain at least 1 number/i
      );
      expect(passwordIsInvalidError).toBeInTheDocument();
    });
  });

  test("error is shown when password is missing at least one symbol", async () => {
    userEvent.type(name, "Solmaz");
    userEvent.type(email, "solmaz@test.com");
    userEvent.type(password, "Test1234");
    userEvent.type(confirmPassword, "Test1234");
    userEvent.click(submitButton);

    await waitFor(async () => {
      const passwordIsInvalidError = await screen.findByText(
        /password must contain at least 1 symbol/i
      );
      expect(passwordIsInvalidError).toBeInTheDocument();
    });
  });

  test("error is shown when user cannot be registered", async () => {
    server.resetHandlers(
      rest.post(
        `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/auth/register`,
        (req, res, ctx) =>
          res(
            ctx.status(400),
            ctx.json({
              message: "User is not registered",
            })
          )
      )
    );
    userEvent.type(name, "Solmaz");
    userEvent.type(email, "solmaz@test.com");
    userEvent.type(password, "Test!123");
    userEvent.type(confirmPassword, "Test!123");
    userEvent.click(submitButton);

    await waitFor(async () => {
      const errorMsg = await screen.findByText(/user is not registered/i);
      expect(errorMsg).toBeInTheDocument();
    });
  });
});
