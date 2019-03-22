const jwt = require('jsonwebtoken');
const keys = require('../configs/keys');

generateJWT = (user) => {
    const today = new Date();
    const expirationDate = new Date();
    expirationDate.setHours(today.getHours() + 2);
    
    const token =  jwt.sign({
        email: user.email,
        id: user._id,
        expiresIn : expirationDate
    }, keys.JWT_SECRET);
    return { token , expirationDate }
}

verifyJWT = (token) => {
    return new Promise((resolve, reject) => jwt.verify(token, keys.JWT_SECRET, (err, decoded) => {
        if (err || !decoded) {
            reject(err);
        }
        resolve(token);
    }));
}

getDecodedJWT = (token) => {
    return jwt.decode(token, keys.JWT_SECRET);
}

module.exports = {
    generateJWT,
    verifyJWT,
    getDecodedJWT
}