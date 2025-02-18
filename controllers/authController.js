import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../services/authService.js";

let refreshTokens = [];

const authController = {
    // REGISTER
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Create new user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,   
            });

            // Save to DB
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },

    // LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) return res.status(404).json({ message: "Wrong username" });

            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) return res.status(404).json({ message: "Wrong password" });

            if (user && validPassword) {
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);
                refreshTokens.push(refreshToken);

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });

                // eslint-disable-next-line no-unused-vars
                const { password, ...others } = user._doc;
                return res.status(200).json({ ...others, accessToken });
            }
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },

    // REQUEST REFRESH TOKEN
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        // if (!refreshToken) return res.status(401).json("You are not authenticated");
        if (!refreshTokens.includes(refreshToken)) return res.status(403).json("Refresh token is not valid");

        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(403).json("Token is invalid");
            }

            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

            // Create new tokens
            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            res.status(200).json({ accessToken: newAccessToken });
        });
    },

    // LOGOUT
    logoutUser: async (req, res) => {
        const authHearder = req.headers.authorization;
        const accessToken = authHearder.split(" ")[1];
        
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
        res.status(200).json("Logout successfully");
    },
};

export default authController;
