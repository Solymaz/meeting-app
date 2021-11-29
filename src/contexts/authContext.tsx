import React, { createContext, useState } from "react";
import { useHistory } from "react-router";
import { TChildren } from "../types/children";
import TLoginData from "../types/login";
import { TUser } from "../types/user";
import { login } from "../services/auth";

type TAuthContext = {
  login: ({ email, password }: TLoginData) => void;
  loginErrorMsg?: string;
  user: TUser;
  logout: () => void;
  loginLoading: boolean;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  setLoginErrorMsg: (errMsg: string | undefined) => void;
};

export const AuthContext = createContext({} as TAuthContext);

export function AuthContextProvider({ children }: TChildren) {
  const [loginLoading, setLoginLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState<string>();
  const [user, setUser] = useState<TUser>({
    name: localStorage.getItem("name") || undefined,
    email: localStorage.getItem("email") || undefined,
    token: localStorage.getItem("token") || undefined,
  });

  const history = useHistory();

  const handleLogin = async ({ email, password }: TLoginData) => {
    setLoginLoading(true);
    setShowWelcome(false);
    const result = await login(email, password);
    if (result.data) {
      const {
        data: { token, name, email: userEmail },
      } = result;
      // store user data in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("email", userEmail);

      setUser({ token, name, email: userEmail });
      setLoginLoading(false);
      setLoginErrorMsg(undefined);
      history.push("/calendar");
    } else {
      setLoginErrorMsg(result.error);
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    setUser({});
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    history.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        login: handleLogin,
        user,
        logout,
        loginLoading,
        loginErrorMsg,
        setShowWelcome,
        showWelcome,
        setLoginErrorMsg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
