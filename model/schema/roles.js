const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rolesSchema = new Schema({
    name:{
        type: String,
    },
    identifier:{
        type: String,
        unique: true,
    },
    modules:[
        {
            name:{
                type:String,
                required:true,
            },
            create:{
                type:Boolean,
                default:false
            },
            update:{
                type:Boolean,
                default:false
            },
            read:{
                type:Boolean,
                default:false
            },
            delete:{
                type:Boolean,
                default:false
            },
            readAll:{
                type:Boolean,
                default:false
            }
        }
    ],
});

module.exports = mongoose.model('Role', rolesSchema)
