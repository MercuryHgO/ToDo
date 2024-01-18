import sha256 = require("sha256");
import prisma from "../prisma.js";
import pkg from "jsonwebtoken"
const {sign, verify} = pkg


type RegistrationData = {
	login: string,
	password: string
}

export async function register(registerData: RegistrationData) {
	registerData.password = sha256(registerData.password)
	
	await prisma.user.create({
		data: registerData
	})
}

type LoginData = {
	login: string,
	password: string
} | {
	access: string
} | {
	refresh: string
}
export async function login(loginData: LoginData) {
	if("login" in loginData && "password" in loginData) {
		loginData.password = sha256(loginData.password)
		
		// TODO P2025 no user found
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				login: loginData.login,
				password: loginData.password
			}
		})
		
		const access = sign(
			{ id: user.id },
			process.env.JWT_ACCESS_KEY,
			{
				expiresIn: "1d"
			}
		)
		const refresh = sign(
			{id: user.id, accessToken: access},
			process.env.JWT_REFRESH_KEY,
			{
				expiresIn: "7d"
			}
		)
		
		return {access, refresh}
	}
	if("access" in loginData) {
		const isDestroyed = await prisma.destroyedTokens.findUnique({
			where: {
				token: loginData.access
			}
		})
		
		// TODO token destroyed
		if(isDestroyed) throw new Error("Token destroyed")
		
		let decodedInfo: {id: string}
		verify(loginData.access, process.env.JWT_ACCESS_KEY, async (error, decoded) => {
			// TODO bad token
			if (error) throw new Error("Jwt malformed")
			
			decodedInfo = decoded as { id: string }
		})
		return decodedInfo
	}
	if("refresh" in loginData) {
		const isDestroyed = await prisma.destroyedTokens.findUnique({
			where: {
				token: loginData.refresh
			}
		})
		
		// TODO token destroyed
		if(isDestroyed) throw new Error("Token destroyed")
		
		let decodedInfo: { id: string, accessToken: string }
		
		verify(loginData.refresh, process.env.JWT_REFRESH_KEY, (error, decoded) => {
			// TODO bad token
			if (error) throw new Error("Jwt malformed")
			
			decodedInfo = decoded as { id: string, accessToken: string }
		})
		
		// sign new keys
		const access = sign(
			{ id: decodedInfo.id },
			process.env.JWT_ACCESS_KEY,
			{
				expiresIn: "1d"
			}
		)
		const refresh = sign(
			{id: decodedInfo.id, accessToken: access},
			process.env.JWT_REFRESH_KEY,
			{
				expiresIn: "7d"
			}
		)
		
		// destroy old keys
		await prisma.destroyedTokens.createMany({
			data: [
				{
					token: decodedInfo.accessToken,
					deleteAt: new Date( Date.now() + 1000 * 60 * 60 * 24 )
				},
				{
					token: loginData.refresh,
					deleteAt: new Date( Date.now() + 1000 * 60 * 60 * 24 * 7 )
				},
			]
		})
		
		return { access, refresh }
	}
	throw new Error("Wrong loginData input")
}