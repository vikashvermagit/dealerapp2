export const CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  APP_NAME: 'Dealer Dashboard',
  IS_DEV: import.meta.env.DEV,
} as const;

export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  SALES: 'sales',
  FINANCE: 'finance',
  OPS: 'ops',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
