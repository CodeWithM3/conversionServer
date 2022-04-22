const jwt = require('jsonwebtoken')
const User = require('../DbConnection/userSchema')


const decode_Authorization = async (req, res,next )=>{
    const reqHeader = req.headers.authorization
    if(!reqHeader){
       return res.json({message: 'Please pass your Authentication Token'})
    }
    const jwtDecode = jwt.verify(reqHeader, 'ghdjakujsbbuebkwki')
    if(!jwtDecode){
        res.json({message: 'Expired or Invalid Token, Login again'})
    }
    const id = jwtDecode.id
    const getUser = await User.findOne({id})
    if(!getUser){
        res.json({message: 'User does not exist' });
    }
    req.user = getUser
    next()
}

module.exports= decode_Authorization;