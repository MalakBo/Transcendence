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
    return res.status(401).json({
      status: "error",
      message: "Invalid mail or password"
    });
  }
  const { name, email, password, role } = req.body;
  if (await findUserByEmail(email)) {
    return res.status(409).json({
      status: "error",
      message: "User already exists with this mail"
    });
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
  sendAuthResponse(res, 200, user, token);
};

/* Login */
// const login = async (req, res) => {
//     console.log("I am your backend");

//     console.log(req.body);
//     res.status(200).json({ message: "Login endpoint reached!" });
// };
const login = async (req, res) => {

  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  const isPasswordValid = user && (await bcrypt.compare(password, user.password));

  if (!isPasswordValid) {
    return res.status(401).json({
      status: "error",
      message: "invalid email or password"
    });
  }
  if (!user.isActive){
    return res.status(403).json({
      status: "error",
      message: "You don't have the right to access"
    });
  }

  const token = generateToken(user.id, res);
  sendAuthResponse(res, 200, user, token);
};

/* Logout */
const logout = async (req, res) => {
  res.clearCookie("jwt", { 
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: "strict",
    path: "/",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
    data: {
      user: null,
      token: null,
    },
  });
};

/* me */
const me = async (req, res) => {
    return sendAuthResponse(res, 200, req.user, null);
};

export { register, login, logout, me };