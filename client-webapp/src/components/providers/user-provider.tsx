import React, { useState, useEffect, ReactNode } from "react";
import {
  User,
  UserContextValue,
  UserContext,
} from "../../lib/context/user-context";
import { getCurrentUser } from "../../lib/oauthClient";

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await getCurrentUser();
      setUser(fetched);
    } catch (err) {
      setError(err as Error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // on mount, load the current user
  useEffect(() => {
    refreshUser();
  }, []);

  const contextValue: UserContextValue = {
    user,
    setUser,
    loading,
    error,
    refreshUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
