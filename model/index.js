const mongoose = require("mongoose");

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pf_uat',
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  ).then(() => console.log('mongodb connected'))
  .catch((err) => console.error('error in '+err))


mongoose.Promise = global.Promise

module.exports = {
    User:require("./schema/users"),
    Module:require("./schema/modules"),
    Role:require("./schema/roles")
}

