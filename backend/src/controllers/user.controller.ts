import { Request, Response } from "express";
import { User } from "../models/user.model";

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

export { signupUser };
