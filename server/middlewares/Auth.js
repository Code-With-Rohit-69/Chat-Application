import jwt from "jsonwebtoken";
import "dotenv/config";

export const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: "Token is not available" });
    }

    console.log(token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    if (!decoded) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    req.user = decoded.id;

    next();
  } catch (error) {
    console.log(`Error in authUser middleware ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Unauthorized access" });
  }
};
