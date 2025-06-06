import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect username or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect username or password",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      console.error("JWT_SECRET_KEY is not defined");
      return res.status(500).json({ message: "Internal server error" });
    }

    const token = jwt.sign(tokenData, secretKey, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // none for cross-origin
      })
      .json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        message: "User logged in",
      });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Other functions (signupUser, signoutUser) remain unchanged
const signupUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({ message: "Username and password are required." });
      return;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User already exists." });
      return;
    }
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });
    res
      .status(201)
      .json({ message: "User signed up successfully.", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

const signoutUser = async (req: Request, res: Response) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export { signupUser, signinUser, signoutUser };