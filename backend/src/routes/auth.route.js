import express from "express";
import { accessRoute } from "../middleware/auth.middleware.js";
import { getAuthUser, login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", accessRoute, getAuthUser);

export default router;
