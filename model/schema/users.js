const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // firstName:{
    //     type:String,
    // },
    // lastName:{
    //     type:String,
    // },
    username: { 
      type: String,
      unique: true,
      default:null,
    },
    email: { 
      type: String,
      unique: true,
      default:null,
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
    },
    facebook_id:{
        type:String,
        default:null,
    },
    google_id:{
        type:String,
        default:null,
    },
    twitter_id:{
        type:String,
        default:null,
    },
    linkedin_id:{
        type:String,
        default:null,
    },
    instagram_id:{
        type:String,
        default:null,
    }
});

UserSchema.path("email").validate(function (email) {
    console.log("email",email)
    if(email && email.length > 0){
        var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(email); 
    }else{
        return true
    }
  
}, "The email field is not valid.");


UserSchema.path("phone").validate(function (phone) {
    var phoneRegex = /^(\+\d{1,2}.-)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone); 
}, "The Phone field is not valid.");

module.exports = mongoose.model('User', UserSchema)