const {User} = require("../model");
const JwtToken = require("jsonwebtoken");
const constant = require("../config/constant");
const Joi = require('joi')
const bcrypt = require("bcryptjs");

const userSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "in", "org"] },
  }),
//   email: Joi.string(),
  phone: Joi.string().regex(
    /^(\+\d{1,2}.-)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
  ),
  password: Joi.string().min(8).required(),
  facebook_id: Joi.string(),
  google_id: Joi.string(),
  twitter_id: Joi.string(),
  linkedin_id: Joi.string(),
  instagram_id: Joi.string(),
}).or("phone", "email");

const socialSchema = Joi.object({
    username: Joi.string(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "in", "org"] },
    }),
    phone: Joi.string().regex(
      /^(\+\d{1,2}.-)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    ),
    facebook_id: Joi.string(),
    google_id: Joi.string(),
    twitter_id: Joi.string(),
    linkedin_id: Joi.string(),
    instagram_id: Joi.string(),
  }).or("facebook_id", "google_id","twitter_id","linkedin_id","instagram_id");

module.exports = {
    async login(req){
        // return req.body
    },
    async register(req){
        const {email,username,password} = req.body
        const {value,error} = userSchema.validate(req.body)
        if(error){
            throw error.message
        }
        console.log("req.session",req.session);
        const getUser = await User.findOne({
            $or:[
                {
                    email:email,
                },
                {
                    username:username
                }
            ]
        });
        // console.log("getUser",getUser);
        if(!getUser){
            value.password = await bcrypt.hashSync(value.password, 10);
            return this.saveUser(value)
                .then((res) => {
                    if(res){
                        req.session.token = res.token
                        return res
                    }
                })
                .catch((err) => {
                    console.error(err)
                    throw err
                })
        }else{
            throw  `User Exist!`
        }
        // return req.body
    },
    async socialRegister(req){
        // return req.body
        const {email,username,facebook_id,instagram_id,linkedin_id,google_id,twitter_id} = req.body
        const {value,error} = socialSchema.validate(req.body)
        if(error){
            throw error.message
        }
        var whereCondition = [];
        if(facebook_id){
            whereCondition.push({
                facebook_id:facebook_id
            })
        }
        if(instagram_id){
            whereCondition.push({
                instagram_id:instagram_id
            })
        }
        if(linkedin_id){
            whereCondition.push({
                linkedin_id:linkedin_id
            })
        }
        if(google_id){
            whereCondition.push({
                google_id:google_id
            })
        }
        if(twitter_id){
            whereCondition.push({
                twitter_id:twitter_id
            })
        }
        if(email){
            whereCondition.push({
                email:email
            })
        }
        const getUser = await User.findOne({
            $or:whereCondition
        });
        console.log("getUser",getUser);
        if(!getUser){
            var randomStr = await this.generateString(30);
            value.password = await bcrypt.hashSync(randomStr, 10);
            console.log("value",value);
            return this.saveUser(value)
                .then((res) => {
                    if(res){
                        req.session.token = res.token
                        return res
                    }
                })
                .catch((err) => {
                    console.error(err)
                    throw err
                })
        }else{
            await User.updateOne({
                "_id":getUser._id
            },{$set:value})
            // throw  `User Exist!`
            const set_response = {
                email:getUser.email,
                username:getUser.username,
                phone:getUser.phone || null,
                facebook_id:getUser.facebook_id,
                google_id:getUser.google_id,
                twitter_id:getUser.twitter_id,
                linkedin_id:getUser.linkedin_id,
                instagram_id:getUser.instagram_id,
                _id:getUser._id
            }
            const jwt_string = JwtToken.sign(
                set_response,
                constant.JWTOBJCMS.secret,
                {
                  expiresIn: constant.JWTOBJCMS.expiresIn,
                  algorithm: constant.JWTOBJCMS.algo,
                }
            );
            set_response.token = jwt_string
            req.session.token = set_response.token
            return set_response
        }
    },
    async saveUser(obj,callback){
        var user = new User(obj)
        return await user.save().then((res) => {
            // console.log("res",res);
            const set_response = {
                email:res.email,
                username:res.username,
                phone:res.phone || null,
                facebook_id:res.facebook_id,
                google_id:res.google_id,
                twitter_id:res.twitter_id,
                linkedin_id:res.linkedin_id,
                instagram_id:res.instagram_id,
                _id:res._id
            }
            const jwt_string = JwtToken.sign(
                set_response,
                constant.JWTOBJCMS.secret,
                {
                  expiresIn: constant.JWTOBJCMS.expiresIn,
                  algorithm: constant.JWTOBJCMS.algo,
                }
            );
            set_response.token = jwt_string
            return set_response
            // callback(null,set_response)
            // return 
            // return set_response
        })
        .catch((err) => {
            console.log("err",err.errors);
            if(err.errors){
                throw err.errors
                // callback(err.errors,null)
            }else{
                // callback(err.message,null)
            }
            // return 
            throw err.message
        })
    },
    async generateString(length) {
        var result = "";
        var characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
}