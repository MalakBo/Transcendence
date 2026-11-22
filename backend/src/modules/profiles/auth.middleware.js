import jwt from "jsonwebtoken";
import { findUserById } from "../auth/auth.utils.js";

const getToken = (req) => {
  if (req.cookies?.jwt) return req.cookies.jwt;
  const header = req.headers.authorization;
  return header?.startsWith("Bearer ") ? header.slice(7) : null;
};

export const protect = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Not authenticated" });
  }
};

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: "You don't have the right to access" });
  }
  next();
};