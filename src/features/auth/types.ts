import { User } from "../users/types";

export interface AuthContextType {
  user: User | null;
  login: (user: LoginUserDTO) => void;
  logout: () => void;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
