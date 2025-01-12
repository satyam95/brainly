import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  res.json({
    message: `User signed up `,
  });
};

const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({ message: "Username and password are required." });
      return;
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
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(tokenData, secretKey, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        message: "User Logedin",
      });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const signoutUser = async (req: Request, res: Response) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

export { signupUser, signinUser, signoutUser };
