const User=require('../models/User');

const {StatusCodes}=require('http-status-codes')

const { BadRequestError,UnauthenticatedError }=require('../errors/index')

const register=async(req,res)=>{

    const { email, password,name}=req.body

    if (!email || !password|| !name) {
        throw new BadRequestError('Please provide valid values ')
    }
    
    //hash password in user model middleware
    const user=await User.create({...req.body})
    //create user token, method in user model
    const token =user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
}
 
 
const login=async(req,res)=>{

    const { email, password}=req.body

    //simple validate 
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    
    //find user 
    const user = await User.findOne({email})
    
    //if there is no user,  throw an error 
    if (!user ) {
        throw new UnauthenticatedError('Invalid credentials')
    }
    //if  user exist 
    //compare password
    const isPasswordCorrect = await user.comparePassword(password)
    
    //if the password its not the same, throw an error
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials')
    }
    
    //if the password is the same, create token
    const token = user.createJWT()

 
    res.status(StatusCodes.OK).json({user:{ name:user.name },token})
}

module.exports ={
    login,
    register
}
