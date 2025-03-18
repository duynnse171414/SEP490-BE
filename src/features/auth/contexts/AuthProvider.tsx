import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "@/features/users/types";
import { LoginUserDTO } from "../types";
import { postData } from "@/api/fetchers";
import { jwtDecode } from "jwt-decode"; // Ensure you import it

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: LoginUserDTO) => {
    const respones = postData("auths/login", userData);
    respones?.then((res) => {
      const data = res.data;
      console.log("Response Data:", data);
      if (data.accessToken) {
        const decodedToken = jwtDecode(data.accessToken);
        console.log("Decoded Token:", decodedToken);
      } else {
        console.error("No accessToken found in response");
      }
    });

    const sampleUser: User = {
      id: 1,
      name: userData.email,
      username: userData.email,
      email: userData.email,
      phone: "+1-202-555-0173",
      website: "https://johndoe.dev",
      address: {
        street: "123 Main St",
        suite: "Apt 4B",
        city: "New York",
        zipcode: "10001",
        geo: {
          lat: "40.7128",
          lng: "-74.0060",
        },
      },
      company: {
        name: "Doe Technologies",
        catchPhrase: "Innovating the Future",
        bs: "tech solutions and software development",
      },
    };

    sessionStorage.setItem("user", JSON.stringify(sampleUser));
    setUser(sampleUser);
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


