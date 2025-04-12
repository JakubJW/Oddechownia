export const UserRoles = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];
