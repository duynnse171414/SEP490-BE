import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { AuthContext } from "./AuthContext";
import { User } from "@/features/users/types";
import { LoginUserDTO } from "../types";
import { postData } from "@/api/fetchers";
import { jwtDecode } from "jwt-decode";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface DecodedToken {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const isTokenValid = (token: string): boolean => {
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  const getValidUserFromStorage = (): User | null => {
    const storedUser = localStorage.getItem("loggedUser");
    if (!storedUser) return null;

    const parsedUser: User = JSON.parse(storedUser);
    return isTokenValid(parsedUser.token) ? parsedUser : null;
  };

  const showLoginMessage = (message: string) => {
    setLoginMessage(message);
    setTimeout(() => setLoginMessage(null), 3000);
  };

  const login = async (userData: LoginUserDTO) => {
    try {
      const response = await postData("auths/login", userData);
      if (response.success && response.data.accessToken) {
        if (!isTokenValid(response.data.accessToken)) throw new Error("Token not valid");

        const decodedToken: DecodedToken = jwtDecode(response.data.accessToken);
        const loggedUser: User = {
          email: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
          role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
          token: response.data.accessToken,
        };

        localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
        setLoggedUser(loggedUser);
        setSuccess(true);
        if (loggedUser.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }

        return { success: true };
      } else {
        showLoginMessage(response.message || "Wrong Email or Password");
        return { success: false, message: response.message || "Wrong Email or Password" };
      }
    } catch (error) {
      showLoginMessage("Wrong Email or Password");
      return { success: false, message: "Wrong Email or Password" };
    }
  };

  const logout = () => {
    localStorage.removeItem("loggedUser");
    setLoggedUser(null);
    navigate("/login"); 
  };

  useEffect(() => {
    const user = getValidUserFromStorage();
    if (user) {
      setLoggedUser(user);
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      }

      const decodedToken: DecodedToken = jwtDecode(user.token);
      const timeUntilExpiration = decodedToken.exp * 1000 - Date.now();

      if (timeUntilExpiration > 0) {
        const timeout = setTimeout(() => {
          logout();
        }, timeUntilExpiration);

        return () => clearTimeout(timeout);
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (loggedUser) {
      const decodedToken: DecodedToken = jwtDecode(loggedUser.token);
      const timeUntilExpiration = decodedToken.exp * 1000 - Date.now();

      const interval = setInterval(() => {
        const validUser = getValidUserFromStorage();
        if (!validUser) {
          logout();
        }
      }, timeUntilExpiration);

      return () => clearInterval(interval);
    }
  }, [loggedUser]);

  return (
    <AuthContext.Provider value={{ user: loggedUser, login, logout, loginMessage, success }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;