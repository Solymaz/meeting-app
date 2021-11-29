import React from "react";
import { createMemoryHistory } from "history";
import { render, screen } from "@testing-library/react";
import { Router } from "react-router";
import NotFound from "../NotFound";

describe("NotFound", () => {
  test("will show not found page on an unmatch route", async () => {
    const history = createMemoryHistory();
    history.push("/badRoute");
    render(
      <Router history={history}>
        <NotFound />
      </Router>
    );

    const image = screen.getByAltText("page not found");
    expect(image).toBeInTheDocument();
  });
});
