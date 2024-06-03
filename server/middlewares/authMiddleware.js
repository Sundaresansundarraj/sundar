const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('No token, authorization denied');
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).send('Token is not valid');
    }
};

module.exports = authMiddleware;

