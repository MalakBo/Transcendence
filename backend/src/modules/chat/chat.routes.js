import { Router } from "express";
<<<<<<< HEAD
import { protect as auth } from "../profiles/auth.middleware.js";
=======
import auth from "../../middleware/auth.middleware.js";
>>>>>>> 1c629c81ac53c782da175bb150fe5dd0609a356d
import * as c from "./chat.controller.js";

const router = Router();
router.get("/conversations", auth, c.list);
router.get("/conversations/:id/messages", auth, c.messages);
export default router;