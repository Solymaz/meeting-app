import React from "react";
import { createMemoryHistory } from "history";
import { render, screen } from "@testing-library/react";
import { Router } from "react-router";
import userEvent from "@testing-library/user-event";
import Meetings from "../Meetings";
import { AuthContext } from "../../contexts/authContext";

describe("Meetings", () => {
  test("Navigation between search meeting and add meeting tabs", async () => {
    const history = createMemoryHistory();
    history.push("/meetings");
    render(
      <Router history={history}>
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
          <Meetings />
        </AuthContext.Provider>
      </Router>
    );
    const pageTitle = screen.getByRole("heading", {
      level: 1,
      name: /meetings/i,
    });
    const searchMeetingTab = screen.getByRole("link", {
      name: /filter \/ search meetings/i,
    });
    const searchMeetingTitle = screen.getByText(/search for meetings/i);
    const addMeetingTab = screen.getByRole("link", { name: /add a meeting/i });
    expect(pageTitle).toBeInTheDocument();
    expect(searchMeetingTab).toBeInTheDocument();
    expect(searchMeetingTitle).toBeInTheDocument();
    expect(addMeetingTab).toBeInTheDocument();
    userEvent.click(addMeetingTab);

    const addMeetingTitle = await screen.findByText(/add a new meeting/i);

    expect(addMeetingTitle).toBeInTheDocument();
  });
});
