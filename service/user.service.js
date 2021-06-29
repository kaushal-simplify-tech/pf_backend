const {User,Module,Role} = require("../model");
const JwtToken = require("jsonwebtoken");
const constant = require("../config/constant");
const Joi = require('joi')
const bcrypt = require("bcryptjs");
const moduleJson = require("../dump/modules");
const rolesJson = require("../dump/roles");

const userSchema = Joi.object({
  firstName:Joi.string().required(),
  lastName:Joi.string().required(),
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
  dateOfBirth:Joi.date().required(),
  identifier:Joi.string()
}).or("phone", "email");

const socialSchema = Joi.object({
    firstName:Joi.string().required(),
    lastName:Joi.string().required(),
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
    dateOfBirth:Joi.date().required(),
    identifier:Joi.string()
  }).or("facebook_id", "google_id","twitter_id","linkedin_id","instagram_id");

const loginSchema = Joi.object({
    username:Joi.string().required(),
    password:Joi.string().required()
})

// const loginSche

module.exports = {
    async login(body){
        const {value,error} = loginSchema.validate(body)
        if(error){
            throw error.message
        }
        // return value
        if(value){
            const findUser = await User.findOne({
                $or:[
                    {
                        email:value.username,
                    },
                    {
                        username:value.username
                    }
                ]
            });
            if(findUser){
                if(bcrypt.compareSync(value.password, findUser.password)){
                    const set_response = {
                        email:findUser.email,
                        username:findUser.username,
                        phone:findUser.phone || null,
                        facebook_id:findUser.facebook_id,
                        google_id:findUser.google_id,
                        twitter_id:findUser.twitter_id,
                        linkedin_id:findUser.linkedin_id,
                        instagram_id:findUser.instagram_id,
                        _id:findUser._id,
                        firstName:findUser.firstName,
                        lastName:findUser.lastName
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
                }else{
                    throw `Incorrect Password!`
                }
            }else{
                throw `User not found!`
            }
        }
    },
    async register(body){
        const {email,username,password,phone} = body
        const {value,error} = userSchema.validate(body)
        if(error){
            throw error.message
        }
        var whereCondition = [];
        if(email){
            whereCondition.push({email:email})
        }
        if(phone){
            whereCondition.push({phone:phone})
        }
        if(username){
            whereCondition.push({username:username})
        }
        const getUser = await User.findOne({
            $or:whereCondition
        });
        // console.log("getUser",getUser,"phone",phone);
        if(!getUser){
            value.password = await bcrypt.hashSync(value.password, 10);
            return this.saveUser(value)
                .then((res) => {
                    if(res){
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
    },
    async socialRegister(body){
        const {email,username,facebook_id,instagram_id,linkedin_id,google_id,twitter_id} = body
        const {value,error} = socialSchema.validate(body)
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
            return set_response
        }
    },
    async saveUser(obj,callback){
        console.log("obj",obj);
        if(!obj.identifier){
            obj.identifier = 'pf_users';
        }
        // console.log("identifier",obj.identifier)
        let roles = await Role.findOne({identifier:obj.identifier});
        // console.log("roles",roles);
        if(roles){
            obj.role_id = roles._id
        }
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
                firstName:res.firstName,
                lastName:res.lastName,
                dateOfBirth:res.dateOfBirth
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
    async dump(req){
        // console.log(moduleJson);
        // return moduleJson
        var promise = await moduleJson.map(async (each) => {
            const resp = await Module.findOne({identifier:each.identifier});
            if(!resp){
                return await Module.create(each)
            }else{
                return resp
            }
        });

        return await Promise.all(promise).then(async (data) => {
            await rolesJson.forEach(async (eachObj,index) => {
                const re = await Role.findOne({identifier:eachObj.identifier});
                if(!re){
                        console.log("identifier",eachObj.modules);
                        let ids = [];
                        await data.filter(async (e) => {
                            let find = await eachObj.modules.includes(e.identifier)
                            if(find){
                                ids.push(e._id)
                            }
                        });
                        Role.create({...eachObj,modules:ids});
                        // console.log('ids',ids);
                        // return id;
                }
                return re
            })
        })
    }
}