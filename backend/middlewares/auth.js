const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "Unauthorized: Token required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Unauthorized: Invalid or expired token" });
    }
};

const authorize = (role) => {
    return (req, res, next) => {
        if (req.user.role === role) {
            next();
        } else {
            return res.status(403).json({ message: "Forbidden: Access denied" });
        }
    };
};

module.exports = { authenticate, authorize };
