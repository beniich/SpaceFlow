const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  if (!token) return null;
  try {
    const secret = process.env.JWT_SECRET || "test-secret-32-chars-minimum-required-yes";
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("[JWT] Token verification failed:", error.message);
    return null;
  }
};

module.exports = { verifyToken };
