import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

export const generateAccessToken = async (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  } catch (error) {
    logger.error(`Error in generateAccessToken: ${error.message}`);
    process.exit(1);
  }
};
