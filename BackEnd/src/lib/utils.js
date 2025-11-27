import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days in ms
    httpOnly: true,
    secure: isProd,                    // true on Render (HTTPS)
    sameSite: isProd ? "none" : "lax", // "none" for cross-site cookies
  });

  return token;
};
