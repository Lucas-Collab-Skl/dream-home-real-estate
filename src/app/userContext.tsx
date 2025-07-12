import { createContext, useContext, useState, ReactNode } from 'react';
import { Staff } from './types';
import { useEffect } from 'react';

interface UserContextType {
    user: Staff | null;
    setUser: (user: Staff | null) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // on mount, check localStorage for user and auth status
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedAuth = localStorage.getItem('isAuthenticated');

        if (savedUser && savedAuth === 'true') {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    // Save to localStorage whenever user or auth state changes
  useEffect(() => {
    if (!isLoading) {
      if (user && isAuthenticated) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }, [user, isAuthenticated, isLoading]);

  const handleSetUser = (newUser: Staff | null) => {
    setUser(newUser);
  };

  const handleSetIsAuthenticated = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
    if (!authenticated) {
      setUser(null);
    }
  };

    return (
        <UserContext.Provider value={{
            user,
            isAuthenticated,
            setUser: handleSetUser,
            setIsAuthenticated: handleSetIsAuthenticated
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};