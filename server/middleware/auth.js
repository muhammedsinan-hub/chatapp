import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log("Header Token:", token);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No Token Provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};
