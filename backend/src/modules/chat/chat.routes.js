import { Router } from "express";
import { protect as auth } from "../profiles/auth.middleware.js";
import * as c from "./chat.controller.js";

const router = Router();
router.get("/conversations", auth, c.list);
router.get("/conversations/:id/messages", auth, c.messages);
export default router;