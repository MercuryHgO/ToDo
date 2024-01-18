import express = require("express");
import bodyParser from "body-parser";
import {config} from "dotenv";
import UserRouter from "./user/index.js";
import TaskListRouter from "./taskList/index.js";

config()

const APP_PORT = process.env.APP_PORT!

const app = express()

app.use(bodyParser.json())

app.use(
	(req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin','*') // f off cors
		res.setHeader('Access-Control-Allow-Headers','*') // f off cors
		res.setHeader('Access-Control-Allow-Methods','*') // f off cors
		next()
	}
)

app.use(
	(err, req, res, next) => {
		console.log(err)
	}
)

app.use("/user",UserRouter)
app.use("/tasks",TaskListRouter)

app.listen(APP_PORT, () => console.log(`Database controller listening on ${APP_PORT}`))