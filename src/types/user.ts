export interface User {
  email: string;
  username: string;
  phone: string;
  website: string;
  company?: {
    name: string;
  };
  address?: {
    city: string;
  };
} 