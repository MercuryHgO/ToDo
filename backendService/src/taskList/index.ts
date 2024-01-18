import {Router} from "express";
import * as auth from '../user/auth.js'
import * as TaskList from './task.js'
import {createUserTask, deleteUserTasks, editUserTask} from "./task.js";
import bodyParser from "body-parser";

const TaskListRouter = Router()

TaskListRouter.use(bodyParser.json())

TaskListRouter.get('/',async (req, res, next) => {
	try {
		const Access = req.get("AccessToken")
		
		const {id} = await auth.login({access: Access}) as { id: string }
		
		const tasks = await TaskList.getUserTasks(id)
		
		res.send(tasks)
	} catch (e) {
		next(e)
	}
} )

TaskListRouter.post('/',async (req, res, next) => {
	try { // createUserTask(id,name,content) -> Task
		const Access = req.get("AccessToken")
		
		const {id} = await auth.login({access: Access}) as { id: string }
		
		const data: {
			name: string,
			content: string,
		} = req.body
		
		const task = await createUserTask(id,data.name,data.content)
		
		res.send(task)
	} catch (e) {
		next(e)
	}
} )

TaskListRouter.patch('/',async (req, res, next) => {
	try { // editUserTask(id,taskId,name,content) -> Task
		const Access = req.get("AccessToken")
		
		const {id} = await auth.login({access: Access}) as { id: string }
		
		const data: {
			id: string,
			name: string,
			content: string,
			status: TaskList.status
		} = req.body
		
		const task = await editUserTask(data.id,id,data.name,data.content,data.status)
		
		res.send(task)
	} catch (e) {
		next(e)
	}
} )

TaskListRouter.delete('/',async (req, res, next) => {
	const Access = req.get("AccessToken")
	
	const {id} = await auth.login({access: Access}) as { id: string }
	
	const data: { id }[] = req.body
	
	await deleteUserTasks(data)
	
	res.sendStatus(200)
} )

export default TaskListRouter