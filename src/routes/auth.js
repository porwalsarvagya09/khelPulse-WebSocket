import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!JWT_SECRET || !ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
  throw new Error("Missing required auth environment variables: JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD_HASH");
}

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  
  const token = jwt.sign(
    { username: ADMIN_USERNAME, role: "admin" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});