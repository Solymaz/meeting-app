import React, { useContext, useState } from "react";
import {
  Container,
  Nav,
  Button,
  Navbar,
  OffcanvasBody,
  OffcanvasHeader,
  OffcanvasTitle,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../contexts/authContext";
import colors from "../styles/color";
import { TUser } from "../types/user";

const StyledNavLink = styled(NavLink)`
  color: ${colors.DARK_GRAY};
  &:hover {
    background-color: ${colors.LIGHT_GRAY};
    color: black;
  }
`;

const NavLinkActiveStyle = {
  backgroundColor: colors.LIGHT_GRAY,
};

const StyledName = styled.span`
  color: ${colors.TEAL};
`;

const StyledLogoutButton = styled(Button)`
  color: ${colors.GRAY};
`;

const StyledNavbarText = styled(Navbar.Text)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const HideOnMobile = styled.div`
  display: flex;
  width: 100%;
  @media (max-width: 768px) {
    display: none;
  }
`;

interface IMenu {
  user: TUser;
  // eslint-disable-next-line react/require-default-props
  toggleMenu?: () => void;
  logout: () => void;
}

function Menu({ user, toggleMenu, logout }: IMenu) {
  return (
    <>
      <Nav className="me-auto" as="ul">
        {user.token && (
          <>
            <Nav.Item as="li" onClick={toggleMenu}>
              <Nav.Link
                style={{ padding: "5px" }}
                to="/calendar"
                as={StyledNavLink}
                activeStyle={NavLinkActiveStyle}
              >
                Calendar
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li" onClick={toggleMenu}>
              <Nav.Link
                style={{ padding: "5px" }}
                to="/meetings"
                as={StyledNavLink}
                activeStyle={NavLinkActiveStyle}
              >
                Meetings
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li" onClick={toggleMenu}>
              <Nav.Link
                style={{ padding: "5px" }}
                to="/teams"
                as={StyledNavLink}
                activeStyle={NavLinkActiveStyle}
              >
                Teams
              </Nav.Link>
            </Nav.Item>
          </>
        )}
      </Nav>
      {user.token && (
        <>
          <StyledNavbarText>
            Hello <StyledName>{user.email}!</StyledName>
          </StyledNavbarText>
          <Nav>
            <StyledLogoutButton
              onClick={logout}
              variant="link"
              className="text-decoration-none fw-bold"
            >
              Logout
            </StyledLogoutButton>
          </Nav>
        </>
      )}
    </>
  );
}

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  return (
    <Navbar bg="light" expand="lg" className="fw-bold">
      <Container>
        <Navbar.Brand>MyMeetings</Navbar.Brand>
        {user.token && (
          <Navbar.Toggle
            onClick={toggleMenu}
            aria-controls="basic-navbar-nav"
            className="ms-auto"
          />
        )}
        <Navbar.Offcanvas
          show={showMenu}
          onHide={toggleMenu}
          placement="top"
          id="basic-navbar-nav"
        >
          <OffcanvasHeader closeButton>
            <OffcanvasTitle>MyMeetings</OffcanvasTitle>
          </OffcanvasHeader>
          <OffcanvasBody>
            <Menu user={user} toggleMenu={toggleMenu} logout={logout} />
          </OffcanvasBody>
        </Navbar.Offcanvas>
        <HideOnMobile>
          <Menu user={user} logout={logout} />
        </HideOnMobile>
      </Container>
    </Navbar>
  );
}
