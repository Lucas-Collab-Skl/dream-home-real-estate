import { createContext, useContext, useState, ReactNode } from 'react';
import { Staff } from './types';
import { useEffect } from 'react';

interface UserContextType {
    user: Staff | null;
    setUser: (user: Staff | null) => void;
    updateUser: (updates: Partial<Staff>) => void;
    logout: () => void;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Staff | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    const userData = JSON.parse(savedUser);
                    // Convert DOB string back to Date if needed
                    if (userData.DOB) {
                        userData.DOB = new Date(userData.DOB);
                    }
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error loading user from localStorage:', error);
                localStorage.removeItem('user'); // Clear corrupted data
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    // Save user to localStorage whenever user state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Helper function to update specific user properties
    const updateUser = (updates: Partial<Staff>) => {
        if (user) {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        setUser,
        updateUser,
        logout,
        isLoading
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}