import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import selectEvent from "react-select-event";
import { AuthContext } from "../../contexts/authContext";
import TeamCard from "../../components/TeamCard";

describe("TeamCard", () => {
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
        <TeamCard
          name="AT"
          description="THis is a team"
          members={[]}
          shortName=""
          teamId="2asdfasdf"
          excuseYourself={jest.fn()}
          users={[{ email: "solmaz@test.com", _id: "2q34234" }]}
          usersFetchErrMsg=""
        />
      </AuthContext.Provider>
    );
  });

  test("has team name", () => {
    const name = screen.getByText("AT");
    expect(name).toBeInTheDocument();
  });

  test("can select a member", async () => {
    const select = screen.getByLabelText(/select a member/i);
    await selectEvent.select(select, ["solmaz@test.com"]);
    const myName = await screen.findByText("solmaz@test.com");
    expect(myName).toBeInTheDocument();
  });
});
