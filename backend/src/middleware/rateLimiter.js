import rateLimit from "express-rate-limit";


export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    error: "Too many requests, please try again later."
  }
});


export const createMatchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 30, 
  message: {
    error: "Too many requests on this endpoint. Try again later."
  }
});