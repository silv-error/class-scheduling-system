import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import logger from "../libs/logger.js";
import dotenv from "dotenv";

dotenv.config();

export const accessRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Error in accessRoute: ${error.message}`);
    next(error);
  }
};

export const adminAccess = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ error: "Forbidden: Admin role is required" });
};

export const instructorAccess = async (req, res, next) => {
  if (req.user && req.user.role === "instructor") {
    return next();
  }
  res.status(403).json({ error: "Forbidden: Instructor role is required" });
};
