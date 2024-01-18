import {Router} from "express";
import * as auth from "./auth.js";

const UserRouter = Router()

UserRouter.get("/signin",async (req, res, next) => {
	try {
		const Refresh = req.get("RefreshToken")
		
		if (!!Refresh) {
			// login(refresh) -> {access,refresh}
			const tokens = await auth.login({ refresh: Refresh} )
			
			res.send(tokens)
			return
		}
		
		const Access = req.get("AccessToken")
		if (!!Access) {
			// login(refresh) -> {access,refresh}
			const tokens = await auth.login({ access: Access} )
			
			res.sendStatus(200)
			return
		}
		
		const {login, password}: {
			login?: string,
			password?: string
		} = req.query
		
		// login(name,login) -> {access,refresh}
		const tokens = await auth.login({ login: login as string, password: password as string} )
		
		
		res.send(tokens)
	} catch (e) {
		next(e)
	}
})
UserRouter.get("/signup",async (req, res, next) => {
	try {
		const {login, password} = req.query
		
		await auth.register({login: password as string, password: password as string})
		
		res.sendStatus(200)
	} catch (e) {
		next(e)
	}
})

export default UserRouter