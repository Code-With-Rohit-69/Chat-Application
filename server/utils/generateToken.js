import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET);
  return token;
};
