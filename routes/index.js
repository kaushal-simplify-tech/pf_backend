const service = require("./service");

module.exports = (app) => {
    app.use('/services',service);
}