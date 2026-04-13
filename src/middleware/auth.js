import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; 

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if header exists
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}