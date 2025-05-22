import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readJsonFile } from "../utils/file.utils";
import { User } from "../interfaces/user.interface";

export const adminLogin = async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  try {
    const users: User[] = readJsonFile("./data/users.json");
    const user = users.find((u: User) => u.name === username);

    if (!user || !(await bcrypt.compare(password, user.passwordHash!))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "1h" }
    );

    res.cookie("admin-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 1000 * 60 * 60, // 1 час
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err); // Логирование
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdmin = (req: Request, res: Response): any => {
    res.status(200).json( true );
};
