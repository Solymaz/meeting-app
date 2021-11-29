import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddMeeting from "../AddMeeting";
import { AuthContext } from "../../contexts/authContext";

describe("Add meeting", () => {
  let title: HTMLElement;
  let name: HTMLElement;
  let date: HTMLElement;
  let description: HTMLElement;
  let attendees: HTMLElement;
  let addMeetingButton: HTMLElement;
  let nameErrMsg: HTMLElement;
  let dateErrMsg: HTMLElement;
  let descriptionErrMsg: HTMLElement;
  let attendeesErrMsg: HTMLElement;

  beforeEach(async () => {
    render(
      <AuthContext.Provider
        value={{
          user: { token: "lskdf934875" },
          login: jest.fn(),
          logout: jest.fn(),
          loginLoading: false,
          showWelcome: false,
          setShowWelcome: jest.fn(),
          setLoginErrorMsg: jest.fn(),
        }}
      >
        <AddMeeting />
      </AuthContext.Provider>
    );

    title = screen.getByRole("heading", { name: /add a new meeting/i });
    name = screen.getByRole("textbox", { name: /name/i });
    date = screen.getByLabelText(/date/i);
    description = screen.getByLabelText(/description/i);
    attendees = screen.getByLabelText(
      /emailIDs of attendees, or team’s short/i
    );
    addMeetingButton = screen.getByRole("button", { name: /add meeting/i });
  });

  test("errors are shown when all the required meeting data is not provided", async () => {
    expect(title).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(date).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(attendees).toBeInTheDocument();

    userEvent.click(addMeetingButton);

    nameErrMsg = await screen.findByText(/name is required/i);
    dateErrMsg = await screen.findByText(/date is required/i);
    descriptionErrMsg = await screen.findByText(/description is required/i);
    attendeesErrMsg = await screen.findByText(
      /at least one attendee is required!/i
    );

    expect(nameErrMsg).toBeInTheDocument();
    expect(dateErrMsg).toBeInTheDocument();
    expect(descriptionErrMsg).toBeInTheDocument();
    expect(attendeesErrMsg).toBeInTheDocument();
  });

  test("no error is shown when all the required data is provided", async () => {
    userEvent.type(name, "solmaz");
    userEvent.type(date, "11-11-2021");
    userEvent.type(description, "Just testing!");
    userEvent.type(attendees, "solmaz@test.com");

    expect(nameErrMsg).not.toBeInTheDocument();
    expect(dateErrMsg).not.toBeInTheDocument();
    expect(descriptionErrMsg).not.toBeInTheDocument();
    expect(attendeesErrMsg).not.toBeInTheDocument();
  });

  test("adding a team will be added to the overview", async () => {
    userEvent.type(name, "Sync");
    userEvent.type(date, "11-12-2021");
    userEvent.type(description, "Lets sync up");
    userEvent.type(attendees, "solmaz@test.com");

    userEvent.click(addMeetingButton);

    waitFor(() => {
      const toast = screen.getByText(/new meeting added!/i);
      expect(toast).toBeInTheDocument();
    });
  });
});
