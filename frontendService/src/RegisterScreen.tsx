import React, {SyntheticEvent, useContext, useState} from "react";
import {Context} from "./App.tsx";
import Cookies from "universal-cookie";

const cookies = new Cookies()

const RegisterScreen = () => {
	
	const [registerScreen,setRegisterScreen] = useContext(Context)
	const [registerStatus,setRegisterStatus] = useState({status: ''})
	
	const handleBoundsClick = () => {
		setRegisterScreen(false)
	};
	
	const handleInBoundsClick = (e: React.MouseEvent) => {
		e.stopPropagation()
	};
	
	const authenticate = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		event.preventDefault()
		const formData = new FormData(event.target as HTMLFormElement)
		const buttonName = ((event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement).name
		
		const login = formData.get("login")
		const password = formData.get("password")
		
		if (buttonName === "registerSubmit") {
			try {
				if (!login) {
					alert('Login required!');
					return
				}
				if (!password) {
					alert('Password required!');
					return
				}
				
				setRegisterStatus(s => {
					return {
						...s,
						status: 'Creating new user...'
					}
				})
				
				const responce = await fetch(`http://${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/user/signup?login=${login}&password=${password}`, {
					
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				})
				
				switch (responce.status) {
					case 200:
						setRegisterStatus({status: 'Successfully created new user!'})
						break
					case 500:
						setRegisterStatus({status: 'Server error'})
						break
					default:
						setRegisterStatus({status: 'Something went wrong'})
						break
				}
			} catch (e: any) {
				setRegisterStatus({status: e.message})
			}
		}
		
		if (buttonName === "loginSubmit") {
			if (!login) {
				alert('Login required!');
				return
			}
			if (!password) {
				alert('Password required!');
				return
			}
			
			setRegisterStatus(s => {
				return {
					...s,
					status: 'Logging in...'
				}
			})
			
			const responce = await fetch(`http://${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/user/signin?login=${login}&password=${password}`)
			
			switch (responce.status) {
				case 200:
					const tokens: {access: string, refresh: string} = await responce.json()
					
					cookies.set('todoAuthTokens',tokens)
					
					window.location.reload()
					break
				case 500:
					setRegisterStatus({status: 'Server error'})
					break
				default:
					setRegisterStatus({status: 'Something went wrong'})
					break
			}
		}
	}
	
	return (<div className={`bg-[rgba(0,0,0,.7)] top-0 absolute w-full h-full ${registerScreen ? "" : "hidden"} flex justify-center`} onClick={handleBoundsClick}>
		<div className={"px-5 py-3 mt-10 bg-white w-[70vh] h-fit text-black rounded-2xl"} onClick={handleInBoundsClick}>
			<form className={"flex flex-col space-y-6"} onSubmit={authenticate}>
				<label className={"flex flex-col "}>
					<p className={"font-light ml-0.5"}>Login</p>
					<input className={"placeholder-black bg-neutral-400 font-extralight text-xl p-1 rounded-lg"} placeholder={"Enter your login"} type={"text"} name={"login"} />
					
				</label>
				<label className={"flex flex-col ml-0.5"}>
					<p className={"font-light"}>Password</p>
					<input className={"placeholder-black bg-neutral-400 font-extralight text-xl p-1 rounded-lg"} placeholder={"Enter your password"} type={"text"} name={"password"} />
				</label>
				<h1 className={`text-center text-2xl`}>{registerStatus.status}</h1>
				<div className={"flex flex-col w-full items-center"}>
					<button className={"bg-blue-500 w-full text-xl text-white p-2 rounded-lg"} type={"submit"} name={"loginSubmit"}>Log in</button>
					<p className={"font-light w-fit"}>Doesn't have account?</p>
					<button className={"bg-neutral-500 w-full text-xl text-white p-2 rounded-lg"} type={"submit"} name={"registerSubmit"}>Sign in</button>
				</div>
			</form>
		</div>
	</div>)
}

export default RegisterScreen