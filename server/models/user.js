const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    coins:{
        type:Number,
        default:100
    }
   
})

userSchema.pre('save',async function(next){
    let user = this;

    if(user.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password,salt);
        user.password = hash;
    }
    next()
})

userSchema.statics.emailTaken = async function(email){
    const user = await this.findOne({email});
    return !!user
}

userSchema.methods.generateAuthToken = function(){
    let user = this;
    const userObj = { sub: user._id.toHexString(),email: user.email,coins:user.coins};
    const token = jwt.sign(userObj,process.env.DB_SECRET,{ expiresIn:'1d'})
    return token;

}

userSchema.methods.comparePassword = async function(candidatePassword){
    /// candidate password = un-hashed password
    const user = this;
    const match = await bcrypt.compare(candidatePassword, user.password);
    return match
}



const User = mongoose.model('User', userSchema);
module.exports = { User };