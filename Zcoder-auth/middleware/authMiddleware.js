// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT token from Authorization header
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1]; // Expected format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user; // Store user info in request
    next();
  });
}

module.exports = { authenticateToken }; // ✅ Named export
