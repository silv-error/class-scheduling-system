import logger from "../libs/logger.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

export const editProfile = async (req, res, next) => {
  try {
    const { email, firstName, lastName, password, confirmPassword } = req.body;
    let { profileImg } = req.body;
    let user = req.user;

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      logger.debug("Invalid email format");
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ _id: { $ne: req.user._id }, email }).lean();
    if (existingUser) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    if (password && confirmPassword) {
      if (password != confirmPassword) {
        return res.status(400).json({ error: "Password do not match" });
      }

      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
      }

      user.password = password;
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
      }
      profileImg = (await cloudinary.uploader.upload(profileImg)).secure_url;
      user.profileImg = profileImg;
    }

    user.email = email || user.email;
    user.fullName = `${firstName} ${lastName}` || user.fullName;

    await user.save();
    res.status(200).json({ ...user._doc, password: undefined });
  } catch (error) {
    logger.error(`Error in editProfile controller: ${error.message}`);
    next(error);
  }
};
