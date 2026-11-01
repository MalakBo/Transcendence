import { db } from "../auth/auth.config.db.js";
import {
  findUserByEmail,
  hashPassword,
  normalizeEmail,
} from "../auth/auth.utils.js";
 
const Users = db.orm.public.User;

const readAdminConfig = () => ({
  name: (process.env.ADMIN_NAME ?? "").trim(),
  email: (process.env.ADMIN_EMAIL ?? "").trim(),
  password: process.env.ADMIN_PASSWORD ?? "",
});

//TO BE ADDED => validateAdmin = checking missing inputs, password_length

export const seedAdmin = async () => {
  const config = readAdminConfig();
 
  const email = config.email;
  const existing = await findUserByEmail(email);
 
  if (existing) {
    if (existing.role === "ADMIN") {
      console.log(`[seed] Admin already exists: ${email}`);
      return existing;
    }
    throw new Error(
      `[seed] ${email} is already used by a non-admin account (${existing.role})`
    );
  }
    const admin = await Users.create({
    name: config.name,
    email,
    password: await hashPassword(config.password),
    role: "ADMIN",
    isActive: true,
  });
 
  console.log(`[seed] Admin created: ${email}`);
  return admin;
};
