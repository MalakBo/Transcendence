import express from "express"
import { register, login, logout, me} from "./auth.controller.js";
import { protect } from "../profiles/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, me);


export default router;
