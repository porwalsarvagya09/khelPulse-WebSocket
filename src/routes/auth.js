import { Router } from "express";
import jwt from "jsonwebtoken";

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET;


const ADMIN = {
  username: "admin",
  password: "admin123",
};
 
authRouter.post("/login", (req, res) => {
  
  const { username, password } = req.body ?? {};

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid login payload" });
  }

  
  if (username !== ADMIN.username || password !== ADMIN.password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  
  const token = jwt.sign(
    { username: ADMIN.username, role: "admin" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});