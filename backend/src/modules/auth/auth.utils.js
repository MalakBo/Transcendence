import jwt from "jsonwebtoken"
import { db } from "./auth.config.db.js";
import bcrypt from "bcryptjs";

//util functions for authentication//

const Users = db.orm.public.User;
const SIGNUP_ROLES = ["ORGANIZER", "PROVIDER"];
const OPTIONAL_FIELDS = ["phone", "avatarUrl"];

export const normalizeEmail = (email) => String(email ?? "").trim().toLowerCase();

export const findUserByEmail = (email) => Users.where({ email: normalizeEmail(email) }).first();

export const findUserById = (id) => {
     return Users.where({ id }).first();
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const isValidSignup = ({ name, email, password, role }) =>
  Boolean(name && email && password && SIGNUP_ROLES.includes(role));

export const pickOptionalFields = (body) =>
  Object.fromEntries(
    OPTIONAL_FIELDS.filter((field) => body[field] != null && body[field] !== "").map(
      (field) => [field, body[field]]
    )
  );

export const generateToken = (userId, res) => {
    const payload = {id: userId};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN  || "7d",
    });
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: (1000 * 60 * 60 * 24) * 7,
    });
    return token;
};

//To be done --> check the @mail.com + uppercase shouldnt create two diff users
//const isValidInput = (name, email, password, phone, avataUrl) => {
//};

//util funtion for the admin seed




//export {generateToken, pickOptionalFields, isValidSignup, hashPassword, findUserByEmail};