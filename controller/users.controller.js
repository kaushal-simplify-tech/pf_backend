const user_service = require("../service/user.service");
const STATUS = require('../config/status').status;
const RESPONSE_MESSAGE = require("../config/cms.message").cmsMessage;

module.exports = {
    async login(req,res){
        try{
            const user_login_res = await user_service.login(req.body);
            // console.log("user_login_res",user_login_res);
            if(user_login_res && user_login_res.token){
                req.session.token = user_login_res.token;
            }
            res.status(STATUS.SUCCESSSTATUS).send({
                data:user_login_res,
                status:STATUS.SUCCESS
            })
        }catch(err){
            console.log('user.controller => login func',err);
            res.status(STATUS.INTERNALSERVERERRORSTATUS).send({
                data:null,
                message:err ? err : RESPONSE_MESSAGE.INTERNAL_SERVER,
                status:STATUS.ERROR
            })
        }
    },
    async register(req,res){
        console.log("req.session",req.session);
        try{
            const user_register_res = await user_service.register(req.body);
            if(user_register_res && user_register_res.token){
                req.session.token = user_register_res.token;
            }
            res.status(STATUS.SUCCESSSTATUS).send({
                data:user_register_res,
                status:STATUS.SUCCESS
            })
        }catch(err){
            console.log('user.controller => register func',err);
            res.status(STATUS.INTERNALSERVERERRORSTATUS).send({
                data:null,
                message:err ? err : RESPONSE_MESSAGE.INTERNAL_SERVER,
                status:STATUS.ERROR
            })
        }
    },
    async socialRegister(req,res){
        try{
            const user_register_res = await user_service.socialRegister(req.body);
            if(user_register_res && user_register_res.token){
                req.session.token = user_register_res.token;
            }
            res.status(STATUS.SUCCESSSTATUS).send({
                data:user_register_res,
                status:STATUS.SUCCESS
            })
        }catch(err){
            console.log('user.controller => socialRegister func',err);
            res.status(STATUS.INTERNALSERVERERRORSTATUS).send({
                data:null,
                message:err ? err : RESPONSE_MESSAGE.INTERNAL_SERVER,
                status:STATUS.ERROR
            })
        }
    },
}