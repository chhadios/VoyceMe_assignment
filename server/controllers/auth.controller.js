const { authService } = require('../services');
const httpStatus = require('http-status');
const jwt_decode= require ("jwt-decode");
const cookieParser = require('cookie-parser')

const authController = {
    async register(req,res,next){
        try{
            const { email, password } = req.body;
            const user = await authService.createUser(email, password);
            const token = await authService.genAuthToken(user);


            res.cookie('x-access-token',token)
            .status(httpStatus.CREATED).send({
                user,
                token
            })
        } catch(error){
            //console.log(error.message)
            res.status(httpStatus.BAD_REQUEST).send(error.message)
        }
    },
    async signin(req,res,next){
        try {
            const { email, password } = req.body;
            const user = await authService.signInWithEmailAndPassword(email, password);
            const token = await authService.genAuthToken(user);

            res.cookie('x-access-token',token)
            .send({ user,token })
        }catch(error){
            res.status(httpStatus.BAD_REQUEST).send(error.message)
        }
    },
    async transfercoins(req,res,next){
        try {
            const token=req.cookies['x-access-token'];
            const decode=jwt_decode(token);
            console.log(decode);
            const { email, coin } = req.body;
            
            if(decode.coins<coin){
                res.send("insufficient funds");
            }else if(decode.email===email){
                res.send("can't send coins to yourself");
            }else{

                const user = await authService.transfercoins(email, coin);
                const you_user = await authService.transfercoins(decode.email, -coin);

                res.send({ you_user})
            }
        }catch(error){
            res.status(httpStatus.BAD_REQUEST).send(error.message)
        }
    },
    async checkbalance(req,res,next){
        try {
            const token=req.cookies['x-access-token'];
            const decode=jwt_decode(token);
                const Balance = await authService.checkbalance(decode.email);
                res.send({Balance});
            
        }catch(error){
            res.status(httpStatus.BAD_REQUEST).send(error.message)
        }
    }
}

module.exports = authController;