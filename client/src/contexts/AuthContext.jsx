import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/env";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || null
  );
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setTokens = (access, refresh) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("refreshToken", refresh);
  };

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      const data = response.data;
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken,
      });

      setAccessToken(response.data.accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  };

  const signupUser = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        name,
        email,
        password,
      });
    } catch (error) {
      console.error("Error signing up:", error);
      return false;
    }
  };

  const createAxiosInstance = () => {
    const instance = axios.create({
      baseURL: API_BASE_URL
    });
    
    instance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return instance;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setAuthLoading(true);
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
        await refreshAccessToken();
      }
      setAuthLoading(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!refreshToken) return;

    const refreshInterval = setInterval(refreshAccessToken, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        setTokens,
        logout,
        authLoading,
        isAuthenticated,
        loginUser,
        signupUser,
        axiosPrivate: createAxiosInstance(),
      }}
    >
      {!authLoading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
