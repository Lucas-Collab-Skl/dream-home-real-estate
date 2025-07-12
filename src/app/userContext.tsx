import { createContext, useContext, useState, ReactNode } from 'react';
import { Staff } from './types';

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

    return (
        <UserContext.Provider value= {{ user, setUser, isAuthenticated, setIsAuthenticated }
}>
    { children }
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