import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { TChildren } from "../../types/children";
import { AuthContextProvider } from "../../contexts/authContext";

const AuthContextWrapper = ({ children }: TChildren) => (
  <Router>
    <AuthContextProvider>{children}</AuthContextProvider>
  </Router>
);

export default AuthContextWrapper;
