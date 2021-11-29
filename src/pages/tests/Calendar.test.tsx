import React from "react";
import { render, screen } from "@testing-library/react";
import Calendar from "../Calendar";
import { AuthContext } from "../../contexts/authContext";

describe("Calendar", () => {
  test("calendar will show the meetings of the current date", async () => {
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
        <Calendar />
      </AuthContext.Provider>
    );
    const meetingTitle = await screen.findByText("Example meeting");
    const attendees = screen.getByText("solmaz@test.com");

    expect(meetingTitle).toBeInTheDocument();
    expect(attendees).toBeInTheDocument();
  });
});
