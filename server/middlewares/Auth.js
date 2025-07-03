import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      res
        .status(404)
        .json({ success: false, message: "Token is not available" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    console.log(decoded);

    if (!decoded) {
      res
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
