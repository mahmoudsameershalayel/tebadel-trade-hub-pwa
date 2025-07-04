
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { login as loginService, register as registerService } from '@/services/auth-service';

interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  subscriptionPlan: 'free' | 'premium' | 'pro';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, isAuthenticated: false };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...initialState, token: null };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

interface AuthContextType {
  state: AuthState;
  login: (phone: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (phone: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const apiResponse = await loginService({ phone, password });
      const { accessToken } = apiResponse.data;
      const user = { 
        id: '1', 
        phone, 
        firstName: 'John', 
        lastName: 'Doe', 
        role: 'user' as const, 
        subscriptionPlan: 'free' as const 
      };
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: accessToken } });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const register = async (payload: RegisterPayload) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      await registerService(payload);
      const user = { 
        id: '1', 
        phone: payload.phone, 
        firstName: payload.firstName, 
        lastName: payload.lastName, 
        role: 'user' as const, 
        subscriptionPlan: 'free' as const 
      };
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: 'mock-token' } });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  useEffect(() => {
    if (state.token && !state.user) {
      const mockUser: User = {
        id: '1',
        phone: '1234567890',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        subscriptionPlan: 'free',
      };
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: mockUser, token: state.token } });
    }
  }, [state.token, state.user]);

  return (
    <AuthContext.Provider value={{ state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
