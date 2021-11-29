import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import selectEvent from "react-select-event";
import Teams from "../Teams";
import { AuthContext } from "../../contexts/authContext";

describe("Teams", () => {
  let name: HTMLElement;
  let shortName: HTMLElement;
  let description: HTMLElement;
  let select: HTMLElement;
  let addMember: HTMLElement;
  let addTeam: HTMLElement;

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
        <Teams />
      </AuthContext.Provider>
    );

    const plusButton = await screen.findByText("+");
    userEvent.click(plusButton);
    name = await screen.findByRole("textbox", { name: /team name/i });
    shortName = await screen.findByRole("textbox", {
      name: /team short name/i,
    });
    description = await screen.findByLabelText(/description/i);
    select = await screen.findByLabelText(/select a member/i);
    addMember = await screen.findByTestId("addMemberButton");
    addTeam = await screen.findByRole("button", { name: /add team/i });
  });

  test("Error is shown when team name is not provided", async () => {
    userEvent.type(shortName, "TestTeam");
    userEvent.type(description, "This is just for test");
    await selectEvent.select(select, ["solmaz@test.com"]);
    userEvent.click(addMember);
    userEvent.click(addTeam);

    const error = await screen.findByText(/name is required!/i);

    expect(error).toBeInTheDocument();
  });

  test("Error is shown when team short name is not provided", async () => {
    userEvent.type(name, "Test Team");
    userEvent.type(description, "This is just for test");
    await selectEvent.select(select, ["solmaz@test.com"]);
    userEvent.click(addMember);
    userEvent.click(addTeam);

    const error = await screen.findByText(/short name is required!/i);

    expect(error).toBeInTheDocument();
  });

  test("Error is shown when team description is not provided", async () => {
    userEvent.type(name, "Test Team");
    userEvent.type(shortName, "TestTeam");
    await selectEvent.select(select, ["solmaz@test.com"]);
    userEvent.click(addMember);
    userEvent.click(addTeam);

    const error = await screen.findByText(/description is required!/i);

    expect(error).toBeInTheDocument();
  });

  test("Teams are shown on load", async () => {
    const firstTeamName = await screen.findByText(/agile team/i);
    const secondTeamName = await screen.findByText(/management team/i);

    expect(firstTeamName).toBeInTheDocument();
    expect(secondTeamName).toBeInTheDocument();
  });

  test("Team is successfuly added when all the required data is provided", async () => {
    userEvent.type(name, "Test Team");
    userEvent.type(shortName, "TestTeam");
    userEvent.type(description, "Just testing!");
    await selectEvent.select(select, ["solmaz@test.com"]);
    userEvent.click(addMember);
    userEvent.click(addTeam);

    const addedTeamShortName = await screen.findByText("@TestTeam");
    const error = screen.queryByRole("alert");
    expect(addedTeamShortName).toBeInTheDocument();
    expect(error).not.toBeInTheDocument();
  });

  test("Excusing yourself from team will remove the team from the overview", async () => {
    const excuseYourselfButtons = await screen.findAllByRole("button", {
      name: /excuse yourself/i,
    });
    userEvent.click(excuseYourselfButtons[0]);
    await waitForElementToBeRemoved(() => screen.queryByText(/we are agile/i));
  });

  test("Error is shown if no member is selected", async () => {
    const add = await screen.findAllByRole("button", {
      name: /add/i,
    });
    userEvent.click(add[0]);
    const addMemberErrMsg = await screen.findByText(/please select a member!/i);

    expect(addMemberErrMsg).toBeInTheDocument();
  });
});
