import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/api';

interface User {
    id: number;
    email: string;
    role: 'patient' | 'doctor' | 'hospital';
    name: string;
    walletAddress?: string;
    isVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, role: string) => Promise<void>;
    loginWithWallet: (walletAddress: string, role: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from token on mount
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const profile = await api.getProfile();
                    setUser({
                        id: profile.id,
                        email: profile.email,
                        role: profile.role,
                        name: profile.name,
                        walletAddress: profile.wallet_address,
                        isVerified: profile.is_verified,
                    });
                } catch (error) {
                    console.error('Failed to load user profile:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setIsLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string, role: string) => {
        try {
            const response = await api.login({ email, password, role });

            // Store user data
            const userData = {
                id: response.user.id,
                email: response.user.email,
                role: response.user.role,
                name: response.user.name,
                walletAddress: response.user.walletAddress,
                isVerified: response.user.isVerified,
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error: any) {
            throw new Error(error.message || 'Login failed');
        }
    };

    const loginWithWallet = async (walletAddress: string, role: string) => {
        try {
            const response = await api.loginWithWallet(walletAddress, role);

            // Store user data
            const userData = {
                id: response.user.id,
                email: response.user.email,
                role: response.user.role,
                name: response.user.name,
                walletAddress: response.user.walletAddress,
                isVerified: response.user.isVerified,
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error: any) {
            throw new Error(error.message || 'Wallet login failed');
        }
    };

    const register = async (userData: any) => {
        try {
            const response = await api.register(userData);

            // If registration successful, automatically log in
            if (userData.role === 'patient' || !response.requiresVerification) {
                await login(userData.email, userData.password, userData.role);
            }

            return response; // Return the response
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        api.clearToken();
        localStorage.removeItem('user');
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithWallet,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
