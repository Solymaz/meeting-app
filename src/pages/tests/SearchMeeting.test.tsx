import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchMeetings from "../SearchMeetings";
import { AuthContext } from "../../contexts/authContext";

describe("Search Meetings", () => {
  test("Search meeting will show all the meetings on load", async () => {
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
        <SearchMeetings />
      </AuthContext.Provider>
    );

    const pageTitle = screen.getByRole("heading", { name: /meetings/i });
    const searchButton = screen.getByRole("button", { name: /search/i });

    expect(pageTitle).toBeInTheDocument();
    userEvent.click(searchButton);

    const searchResultTitle = await screen.findByRole("heading", {
      name: /meetings matching search criteria/i,
    });
    const meetingName = await screen.findByText(/example meeting/i);
    const meetingDate = await screen.findByText("12 November 2021");
    const time = await screen.findByText("13:30 - 17:30");

    const excuseYourselfButton = await screen.findByRole("button", {
      name: /excuse yourself/i,
    });
    const attendees = await screen.findByText(/solmaz@test.com/i);
    const selectMember = await screen.findByText(/select member/i);
    const addButton = await screen.findByRole("button", { name: /add/i });

    expect(searchResultTitle).toBeInTheDocument();
    expect(meetingName).toBeInTheDocument();
    expect(meetingDate).toBeInTheDocument();
    expect(time).toBeInTheDocument();
    expect(excuseYourselfButton).toBeInTheDocument();
    expect(attendees).toBeInTheDocument();
    expect(selectMember).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });

  test("Excuseing yourself from meeting will remove the meeting from the list", async () => {
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
        <SearchMeetings />
      </AuthContext.Provider>
    );

    const name = await screen.findByText("Example meeting");

    expect(name).toBeInTheDocument();

    const excuseYourselfButton = await screen.findByRole("button", {
      name: /excuse yourself/i,
    });
    expect(excuseYourselfButton).toBeInTheDocument();

    userEvent.click(excuseYourselfButton);

    await waitForElementToBeRemoved(() =>
      screen.queryByText(/example meeting/i)
    );
    expect(name).not.toBeInTheDocument();
  });
});
