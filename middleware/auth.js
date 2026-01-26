const JWT = require('jsonwebtoken');
const User = require('../models/User');
const auth = async (req, res , next) =>{
    try {
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = JWT.verify(token,process.env.JWT_SECRET_KEY);
        const user = await User.findOne({_id:decoded._id})
        if(!user){
            throw new Error('Unable to login,Invalid User');
        }
        req.user = user;
        req.token = token;
        next()
        
    } catch (error) {
        res.status(401).send(error.message)
        
    }
}
module.exports = auth;