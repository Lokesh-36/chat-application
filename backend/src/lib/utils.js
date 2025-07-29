import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
res.cookie("jwt", token, {
  httpOnly: true,
  secure: false,      // allow cookie over HTTP for now
  sameSite: "Lax",    // works for most same-site use cases
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


  return token;
};
