import { createContext } from "react";

export interface User {
  sub: string;
  email: string;
}

export interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  error: Error | null;
  refreshUser: () => Promise<void>;
}

// initialize with undefined so we can catch missing provider
export const UserContext = createContext<UserContextValue | undefined>(
  undefined
);
