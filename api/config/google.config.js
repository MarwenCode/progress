import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing Google OAuth credentials in .env file');
  process.exit(1);
}

console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);

export const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
}; 