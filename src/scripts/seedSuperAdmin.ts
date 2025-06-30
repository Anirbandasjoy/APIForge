import mongoose from 'mongoose';
import UserModel from '@/app/modules/user/user.model';
import dbConnection from '@/config/db';
import { superAdminCreateDetail } from './superAdminCreateDetail';
import dotenv from 'dotenv';

dotenv.config();

(async function () {
  try {
    await dbConnection();

    const { name, email, password } = superAdminCreateDetail;
    if (!email || !password) throw new Error('Super admin email/password missing');

    const exists = await UserModel.exists({ email, role: 'superadmin' });
    if (exists) {
      console.warn('Super admin already exists — skipping seed.');
      return;
    }

    const superAdmin = await UserModel.create({
      name,
      email,
      password,
      role: 'superadmin',
    });

    console.log('Super admin seeded:', { _id: superAdmin._id, email: superAdmin.email });
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed super admin:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
})();
