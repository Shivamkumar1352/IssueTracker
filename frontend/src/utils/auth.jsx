import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { handleError } from "./utils";

const SESSION_EXPIRED_MESSAGE = "Session expired. Please log in again.";

let hasShownSessionExpired = false;

const resetSessionExpiredFlag = () => {
  window.setTimeout(() => {
    hasShownSessionExpired = false;
  }, 1500);
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getStoredToken = () => localStorage.getItem("token");

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;

  return decoded.exp * 1000 <= Date.now();
};

export const getValidToken = () => {
  const token = getStoredToken();
  if (!token) return null;

  return isTokenExpired(token) ? null : token;
};

export const hasValidSession = () => Boolean(getValidToken());

export const getUserRole = () => {
  const token = getValidToken();
  if (!token) return null;

  return decodeToken(token)?.role || null;
};

export const expireSession = (message = SESSION_EXPIRED_MESSAGE) => {
  clearAuth();

  if (!hasShownSessionExpired) {
    hasShownSessionExpired = true;
    handleError(message);
    resetSessionExpiredFlag();
  }
};

export const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
};

export const handleUnauthorized = (message = SESSION_EXPIRED_MESSAGE) => {
  expireSession(message);
  redirectToLogin();
};

export const initializeAuth = () => {
  if (getStoredToken() && !getValidToken()) {
    clearAuth();
  }

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        handleUnauthorized(
          error.response?.data?.message === "Invalid or expired token"
            ? SESSION_EXPIRED_MESSAGE
            : error.response?.data?.message || SESSION_EXPIRED_MESSAGE
        );
      }

      return Promise.reject(error);
    }
  );
};
