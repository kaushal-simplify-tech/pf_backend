const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { 
      type: String,
      default:null,
    },
    email: { 
      type: String,
      default:null,
    },
    password:{
        type:String,
        minLength:8,
        maxLength:16,
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
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email.text); 
}, "The email field is not valid.");


UserSchema.path("phone").validate(function (phone) {
    var phoneRegex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone.text); 
}, "The Phone field is not valid.");

module.exports = mongoose.model('User', UserSchema)