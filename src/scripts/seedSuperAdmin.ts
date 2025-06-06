import UserModel from '@/app/modules/user/user.model';
import dbConnection from '@/config/db';
import { exists } from '@/services/existCheckService';
import { hashPassword } from '@/utils/hash';
import { superAdminCreateDetail } from './superAdminCreateDetail';
import { createDocument } from '@/app/db/mongoose.helpers';

async function seedSuperAdmin() {
  try {
    await dbConnection();
    const isExistingSuperAdmin = await exists(UserModel, { email: superAdminCreateDetail.email });

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

    const superAdmin = await createDocument(UserModel, userData);

    console.log('Super Admin seeded successfully', superAdmin);
  } catch (error) {
    console.error('Error seeding super admin:', error);
  }
}

seedSuperAdmin();
