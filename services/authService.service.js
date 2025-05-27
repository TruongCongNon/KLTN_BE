import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, admin: user.admin, role: user.role },
    process.env.JWT_ACCESS_KEY,
    { expiresIn: "1m" }
  );
};
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, admin: user.admin, role: user.role },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: "365d" }
  );
};
