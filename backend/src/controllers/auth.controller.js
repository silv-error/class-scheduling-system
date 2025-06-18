import { generateAccessToken } from "../libs/jwt.js";
import logger from "../libs/logger.js";
import User from "../models/user.model.js";

export const signup = async (req, res, next) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      logger.debug("Invalid email format");
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ error: "User already exist" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    const user = new User({
      email,
      fullName: `${firstName} ${lastName}`,
      password,
    });

    generateAccessToken(user._id, res);
    await user.save();

    res.status(201).json({ ...user._doc, password: undefined });
  } catch (error) {
    logger.error(`Error in signup controller: ${error.message}`);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    generateAccessToken(user._id, res);

    res.status(200).json({ ...user._doc, password: undefined });
  } catch (error) {
    logger.error(`Error in login controller: ${error.message}`);
    next(error);
  }
};

export const logout = async (_, res, next) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error(`Error in logout controller: ${error.message}`);
    next(error);
  }
};

export const getAuthUser = async (req, res, next) => {
  try {
    res.status(200).json({ ...req.user._doc, password: undefined });
  } catch (error) {
    logger.error(`Error in getAuthUser controller: ${error.message}`);
    next(error);
  }
};
