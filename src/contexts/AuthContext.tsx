
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { login as loginService, register as registerService } from '@/services/auth-service';
import { ProfileService } from '@/services/profile-service';
import { fcmService } from '@/services/fcm-service';

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
  isLoading: !!localStorage.getItem('token'), // Set loading to true if token exists
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
  logout: () => Promise<void>;
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
      
      // Store token first so ProfileService can use it
      localStorage.setItem('token', accessToken);
      
      const profileData = await ProfileService.getProfile();
      
      // Map UserProfileDto to User interface
      const nameParts = profileData.fullName ? profileData.fullName.trim().split(' ') : [];
      const user: User = {
        id: profileData.id,
        phone: profileData.phoneNumber,
        firstName: nameParts[0] || profileData.username || 'User',
        lastName: nameParts.slice(1).join(' ') || '',
        role: profileData.userType === 'admin' ? 'admin' : 'user',
        subscriptionPlan: 'free',
        avatar: profileData.imageURL,
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
      
      // After successful registration, login to get a real token
      const loginResponse = await loginService({ 
        phone: payload.phone, 
        password: payload.password 
      });
      
      const { accessToken } = loginResponse.data;
      
      // Store token first so ProfileService can use it
      localStorage.setItem('token', accessToken);
      
      const profileData = await ProfileService.getProfile();
      
      // Map UserProfileDto to User interface
      const nameParts = profileData.fullName ? profileData.fullName.trim().split(' ') : [];
      const user: User = {
        id: profileData.id,
        phone: profileData.phoneNumber,
        firstName: nameParts[0] || profileData.username || payload.firstName,
        lastName: nameParts.slice(1).join(' ') || payload.lastName,
        role: profileData.userType === 'admin' ? 'admin' : 'user',
        subscriptionPlan: 'free',
        avatar: profileData.imageURL,
      };
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: accessToken } });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Unsubscribe from notifications before logout
      await fcmService.unsubscribe();
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
    }
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  useEffect(() => {
    if (state.token && !state.user) {
      // Try to get the user profile with the stored token
      ProfileService.getProfile()
        .then((profileData) => {
          const nameParts = profileData.fullName ? profileData.fullName.trim().split(' ') : [];
          const user: User = {
            id: profileData.id,
            phone: profileData.phoneNumber,
            firstName: nameParts[0] || profileData.username || 'User',
            lastName: nameParts.slice(1).join(' ') || '',
            role: profileData.userType === 'admin' ? 'admin' : 'user',
            subscriptionPlan: 'free',
            avatar: profileData.imageURL,
          };
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: state.token! } });
        })
        .catch((error) => {
          console.error('Failed to restore user session:', error);
          // If the token is invalid, clear it
          dispatch({ type: 'LOGOUT' });
        });
    } else if (!state.token) {
      // If no token, ensure loading is false
      if (state.isLoading) {
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    }
  }, [state.token, state.user, state.isLoading]);

  return (
    <AuthContext.Provider value={{ state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
