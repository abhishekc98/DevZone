const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //get token from header
    const token = req.header('x-auth-token');

    //No token
    if(!token){
        return res.status(401).json({ msg: 'No token - Unauthorized !!!' });
    }

    //Verify token
    try{
        const decoded =  jwt.verify(token, process.env.jwtSecret);
        req.user = decoded.user;
        next();
    }catch(err){
        res.status(401).json({ msg: 'Invalid token' });
    }
}