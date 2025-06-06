import dotenv from 'dotenv';

dotenv.config();

const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME;
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

export const superAdminCreateDetail = {
  name: SUPER_ADMIN_NAME,
  email: SUPER_ADMIN_EMAIL,
  password: SUPER_ADMIN_PASSWORD,
};
