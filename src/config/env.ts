import fs from 'fs';
import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load .env file
const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('⚠️  .env file not found. Please create one based on .env.example');
  process.exit(1);
} else {
  dotenv.config();
}

// Compare .env with .env.example
const envFile = fs.readFileSync(envPath, 'utf8');
const envLines = envFile
  .split('\n')
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => line.split('=')[0].trim());

const examplePath = path.resolve(process.cwd(), '.env.example');
const exampleKeys = fs.existsSync(examplePath)
  ? fs
      .readFileSync(examplePath, 'utf8')
      .split('\n')
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => line.split('=')[0].trim())
  : [];

const missingKeys = exampleKeys.filter((key) => !envLines.includes(key));
if (missingKeys.length > 0) {
  console.error(
    `⚠️  Missing environment variables from .env:\n   ${missingKeys.join(
      ', '
    )}\nPlease update your .env file to match .env.example`
  );
  process.exit(1);
}

const extraKeys = envLines.filter((key) => !exampleKeys.includes(key));
if (extraKeys.length > 0) {
  console.warn(
    `⚠️  Extra variables found in .env (not in .env.example):\n   ${extraKeys.join(
      ', '
    )}\nThese will be ignored.`
  );
}

// Zod schema for validation
const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/, 'PORT must be a number'),
  NODE_ENV: z.enum(['development', 'production', 'test']),

  CLIENT_URI: z.string().url('CLIENT_URI must be a valid URL'),
  SERVER_URI: z.string().url('SERVER_URI must be a valid URL'),

  SUPER_ADMIN_NAME: z.string().min(1, 'SUPER_ADMIN_NAME is required'),
  SUPER_ADMIN_EMAIL: z.string().email('SUPER_ADMIN_EMAIL must be valid'),
  SUPER_ADMIN_PASSWORD: z.string().min(6, 'SUPER_ADMIN_PASSWORD too short'),

  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),

  SMTP_USERNAME: z.string().min(1, 'SMTP_USERNAME is required'),
  SMTP_PASSWORD: z.string().min(1, 'SMTP_PASSWORD is required'),

  JWT_ACCESS_SECRET_KEY: z.string().min(1, 'JWT_ACCESS_SECRET_KEY is required'),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1, 'JWT_ACCESS_EXPIRES_IN is required'),

  JWT_REFRESH_SECRET_KEY: z.string().min(1, 'JWT_REFRESH_SECRET_KEY is required'),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1, 'JWT_REFRESH_EXPIRES_IN is required'),

  JWT_PROCESS_REGISTRATION_SECRET_KEY: z
    .string()
    .min(1, 'JWT_PROCESS_REGISTRATION_SECRET_KEY is required'),
  JWT_PROCESS_REGISTRATION_EXPIRES_IN: z.string().default('10m'),

  JWT_PASSWORD_FORGOT_PASSWORD_SECRET: z
    .string()
    .min(1, 'JWT_PASSWORD_FORGOT_PASSWORD_SECRET is required'),
  JWT_PASSWORD_FORGOT_PASSWORD_EXPIRES_IN: z.string().default('10m'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n⚠️  Invalid environment variable values:\n');
  Object.entries(parsed.error.format()).forEach(([key, value]) => {
    if (value && '_errors' in value && value._errors.length > 0) {
      console.error(`   ${key}: ${value._errors.join(', ')}`);
    }
  });
  console.error('\nPlease fix the above errors in your .env file.');
}

let config: {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  CLIENT_URI: string;
  SERVER_URI: string;
  SUPER_ADMIN_NAME: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  MONGO_URI: string;
  SMTP_USERNAME: string;
  SMTP_PASSWORD: string;
  JWT_ACCESS_SECRET_KEY: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_SECRET_KEY: string;
  JWT_REFRESH_EXPIRES_IN: string;
  JWT_PROCESS_REGISTRATION_SECRET_KEY: string;
  JWT_PROCESS_REGISTRATION_EXPIRES_IN: string;
  JWT_PASSWORD_FORGOT_PASSWORD_SECRET: string;
  JWT_PASSWORD_FORGOT_PASSWORD_EXPIRES_IN: string;
};

if (parsed.success) {
  const {
    PORT,
    NODE_ENV,
    CLIENT_URI,
    SERVER_URI,
    SUPER_ADMIN_NAME,
    SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD,
    MONGO_URI,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    JWT_ACCESS_SECRET_KEY,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_SECRET_KEY,
    JWT_REFRESH_EXPIRES_IN,
    JWT_PROCESS_REGISTRATION_SECRET_KEY,
    JWT_PROCESS_REGISTRATION_EXPIRES_IN,
    JWT_PASSWORD_FORGOT_PASSWORD_SECRET,
    JWT_PASSWORD_FORGOT_PASSWORD_EXPIRES_IN,
  } = parsed.data;

  config = {
    PORT: parseInt(PORT, 10),
    NODE_ENV,
    CLIENT_URI,
    SERVER_URI,
    SUPER_ADMIN_NAME,
    SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD,
    MONGO_URI,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    JWT_ACCESS_SECRET_KEY,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_SECRET_KEY,
    JWT_REFRESH_EXPIRES_IN,
    JWT_PROCESS_REGISTRATION_SECRET_KEY,
    JWT_PROCESS_REGISTRATION_EXPIRES_IN,
    JWT_PASSWORD_FORGOT_PASSWORD_SECRET,
    JWT_PASSWORD_FORGOT_PASSWORD_EXPIRES_IN,
  };
} else {
  config = {} as any;
}

export { config };