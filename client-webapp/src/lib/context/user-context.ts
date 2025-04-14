import { createContext } from "react";

// shape of your user object returned from /userinfo
export interface User {
  sub: string;
  email: string;
}

// what the context will expose
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
