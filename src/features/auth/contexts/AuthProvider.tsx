import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "@/features/users/types";
import { LoginUserDTO } from "../types";
import { postData } from "@/api/fetchers";
import { jwtDecode } from "jwt-decode";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("loggedUser");
    if (storedUser) {
      setLoggedUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (userData: LoginUserDTO) => {
    try {
      const response = await postData("auths/login", userData);
      const data = response.data;
      const success = response.success;

      if (success && data.accessToken) {
        const decodedToken: any = jwtDecode(data.accessToken);

        const loggedUser: User = {
          email:
            decodedToken[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            ],
          role: decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ],
        };

        sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
        setLoggedUser(loggedUser);
        setSuccess(true);
        return { success: true };
      } else {
        setLoginMessage(response.message || "Wrong Username or Password");
        setTimeout(() => {
          setLoginMessage(null);
        }, 3000);

        return { success: false, message: response.message || "Wrong Username or Password" };
      }
    } catch (error) {
      setLoginMessage("Login failed. Please try again.");
      setTimeout(() => {
        setLoginMessage(null);
      }, 2000);

      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const logout = () => {
    sessionStorage.removeItem("loggedUser");
    setLoggedUser(null);
  };

  return (
    <AuthContext.Provider value={{ user: loggedUser, login, logout, loginMessage, success }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
