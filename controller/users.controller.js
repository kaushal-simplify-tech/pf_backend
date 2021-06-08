const user_service = require("../service/user_service");
const STATUS = require('../config/status').status;
const RESPONSE_MESSAGE = require("../config/cms.message").cmsMessage;

module.exports = {
    async login(req,res){
        try{
            const user_login_res = await user_service.isUserNameUnique(req);
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
    }
}