import { db } from "./auth.config.db.js";
import bcrypt from "bcryptjs";
import {
  generateToken,
  pickOptionalFields,
  isValidSignup,
  hashPassword,
  findUserByEmail,
} from "./auth.utils.js";

const Users = db.orm.public.User;

const sendAuthResponse = (res, status, user, token) =>
  res.status(status).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      token,
    },
  });

/* Sign up */
const register = async (req, res) => {
  if (!isValidSignup(req.body)) {
    return res
      .status(400)
      .json({ error: "name, email, password and a valid role are required" });
  }

  const { name, email, password, role } = req.body;

  if (await findUserByEmail(email)) {
    return res.status(400).json({ error: "User already exists with this mail" });
  }

  //TO BE ADDED => checking if the fields (name, mail..) are valid
 
  const user = await Users.create({
    name,
    email,
    password: await hashPassword(password),
    role,
    ...pickOptionalFields(req.body),
  });

  const token = generateToken(user.id, res);
  sendAuthResponse(res, 201, user, token);
};

/* Login */
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  const isPasswordValid = user && (await bcrypt.compare(password, user.password));
  if (!isPasswordValid) {
    return res.status(401).json({ error: "invalid email or password" });
  }
  if (!user.isActive){
    return res.status(403).json({ error: "You don't have the right to access" });
  }

  const token = generateToken(user.id, res);
  sendAuthResponse(res, 201, user, token);
};

/* Logout */
const logout = async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export { register, login, logout };