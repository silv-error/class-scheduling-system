import express from "express";
import { editProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.put("/", editProfile);

export default router;
