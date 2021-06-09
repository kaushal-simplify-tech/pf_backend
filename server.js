require("dotenv").config();
const http = require("http");
const express = require("express");
const body_parser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const port = "8000";
const server = http.createServer(app);
const index_router = require("./routes");
const path = require("path");
const session = require('express-session');
var cookie_config = {
	secret: process.env.COOKIE_SECRET,
	resave: true,
	saveUninitialized: true,
	cookie:{},
}

if(process.env.NODE_ENV === 'production'){
	app.set('trust proxy', 1)
	cookie_config.cookie.secure = true;
}
// console.log(process.env.NODE_ENV);
console.log("cookie_config",cookie_config);

app.use(session(cookie_config));
app.use(logger("dev"));
app.use(cors());

app.use("/static", express.static(path.join(__dirname, "public")));

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
index_router(app);

server.listen(port, () => {
	console.log(`Server running at ${port}`);
});

module.exports = app;
