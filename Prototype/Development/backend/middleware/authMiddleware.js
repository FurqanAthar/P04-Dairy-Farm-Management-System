import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Farm from "../models/farmModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization
  ) {
    try {
        token = req.headers.authorization

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let farm = await Farm.findById(decoded.farmId)
        if (farm) {
            if (farm.checkUserById(decoded.userId)) {
                req.user = await User.findById(decoded.userId)
            } else {
                res.status(401)
                throw new Error("Not authorized, token failed")
            }
        }

        next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };
