import React from "react";
import { Nav } from "react-bootstrap";
import { Route } from "react-router";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import AddMeeting from "./AddMeeting";
import SearchMeetings from "./SearchMeetings";

const StyledNavItem = styled(Nav.Item)`
  @media (max-width: 768px) {
    a {
      padding: 5px;
    }
  }
`;

export default function Meetings() {
  return (
    <>
      <h1>Meetings</h1>
      <hr />
      <Nav variant="tabs" defaultActiveKey="/meetings" className="fw-bold">
        <StyledNavItem>
          <Nav.Link exact to="/meetings" as={NavLink}>
            Filter / Search meetings
          </Nav.Link>
        </StyledNavItem>
        <StyledNavItem>
          <Nav.Link to="/meetings/add" as={NavLink}>
            Add a meeting
          </Nav.Link>
        </StyledNavItem>
      </Nav>
      <Route exact path="/meetings" component={SearchMeetings} />
      <Route path="/meetings/add" component={AddMeeting} />
    </>
  );
}
