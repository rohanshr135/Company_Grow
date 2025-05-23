import jwt from "jsonwebtoken";

export const generateTokenAndSendCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
  res.cookie("token", token, {
    httpOnly: true, //prevnet xss attacks
    secure: process.env.NODE_ENV !== "development", // set to true in production
    sameSite: "strict", // prevent CSRF attacks
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  });
};
export default generateTokenAndSendCookie;
