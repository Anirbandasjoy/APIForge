import UserModel from '@/app/modules/user/user.model';
import dbConnection from '@/config/db';
import { hashPassword } from '@/utils/hash';
import { superAdminCreateDetail } from './superAdminCreateDetail';
import { existUserByEmail } from '@/app/modules/user/user.service';

async function seedSuperAdmin() {
  try {
    await dbConnection();
    const isExistingSuperAdmin = await existUserByEmail(
      UserModel,
      superAdminCreateDetail.email as string
    );

    if (isExistingSuperAdmin) {
      console.log('Super Admin already exists. Skipping seed.');
      return;
    }

    if (!superAdminCreateDetail.password) {
      console.error('Super Admin password is not provided in superAdminCreateDetail.');
      return;
    }
    const hashedPassword = await hashPassword(superAdminCreateDetail.password);

    const userData = {
      name: superAdminCreateDetail.name,
      email: superAdminCreateDetail.email,
      password: hashedPassword,
      role: 'superadmin',
    };

    const superAdmin = await UserModel.create(userData);
    if (!superAdmin) {
      console.error('Failed to create Super Admin. Please check the user data.');
      return;
    }

    console.log('Super Admin seeded successfully', superAdmin);
  } catch (error) {
    console.error('Error seeding super admin:', error);
  }
}

seedSuperAdmin();
