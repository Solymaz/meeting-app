/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { Route, RouteProps, Switch } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Calendar from "./pages/Calendar";
import Meetings from "./pages/Meetings";
import Teams from "./pages/Teams";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import { AuthContext, AuthContextProvider } from "./contexts/authContext";
import NotFound from "./pages/NotFound";
import { TChildren } from "./types/children";

type TCustomRoute = RouteProps & TChildren;

function PrivateRoute({ children, ...rest }: TCustomRoute) {
  const { user } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() =>
        user.token ? children : <Redirect to={{ pathname: "/login" }} />
      }
    />
  );
}

function PublicRoute({ children, ...rest }: TCustomRoute) {
  const { user } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() =>
        !user.token ? children : <Redirect to={{ pathname: "/calendar" }} />
      }
    />
  );
}

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <Header />
        <Container className="my-4">
          <Switch>
            <PrivateRoute path="/calendar">
              <Calendar />
            </PrivateRoute>
            <PrivateRoute path="/meetings">
              <Meetings />
            </PrivateRoute>
            <PrivateRoute path="/teams">
              <Teams />
            </PrivateRoute>
            <PublicRoute path="/login">
              <Login />
            </PublicRoute>
            <PublicRoute path="/registration">
              <Registration />
            </PublicRoute>
            <Redirect exact path="/" to="/login" />
            <Route path="*" component={NotFound} />
          </Switch>
        </Container>
      </AuthContextProvider>
    </Router>
  );
}

export default App;
