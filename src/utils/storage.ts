
import { STORAGE_KEY } from "@/constants";
export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEY||"MERCHANT_PORTAL");
  return user ? JSON.parse(user) : null
}

export const setUser = (user: any) => {
  localStorage.setItem(STORAGE_KEY||"MERCHANT_PORTAL", JSON.stringify(user));
}

export const getToken = () => {
  const user = getUser();
  return user?.token || null
}

export const getProfile = () => {
  const user = getUser();
  return user?.profile || null
}

export const getRoutes = () => {
  const user = getUser();
  return user?.routes || null
}

export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEY||"MERCHANT_PORTAL");
}

export const removeAuthority = () => {
  localStorage.removeItem('antd-pro-authority');
}

export const clearStorage = () => {
  removeUser();
  removeAuthority();
  sessionStorage.clear();
}

// localStorage
export const setLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data))
}

export const getLocalStorage = (key: string): string => localStorage.getItem(key) || ''

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key)
}

// sessionStorage
export const setSessionStorage = (key: string, data: any) => {
  sessionStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data))
}

export const getSessionStorage = (key: string): string => sessionStorage.getItem(key) || ''

export const removeSessionStorage = (key: string) => {
  sessionStorage.removeItem(key)
}