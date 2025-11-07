import dotenv from 'dotenv';

dotenv.config();

const required = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

required.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Environment variable ${key} is not set. Some features may not work.`);
  }
});
