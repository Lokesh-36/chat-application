import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,            // must be true when using SameSite=None
    sameSite: "None",        // allow cookie across Vercel <-> Render
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
