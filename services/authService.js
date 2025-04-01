import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, admin: user.admin },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "10h" }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, admin: user.admin },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "365d" }
    );
};
