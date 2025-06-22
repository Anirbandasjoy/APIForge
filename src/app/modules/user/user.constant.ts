export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  SUPERADMIN: 'superadmin',
  STUDENT: 'student',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
