import { createContext } from "react";
import { AuthContextType } from "../types";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => { },
  logout: () => { },
  loginMessage: "",
  success: false,
});
