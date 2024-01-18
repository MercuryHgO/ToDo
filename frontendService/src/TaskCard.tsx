import {Tokens} from "./App.tsx";
import {useRef, useState} from "react";
import Cookies from "universal-cookie";

export type TaskInfo = {
	id?: string
	name: string,
	content: string,
	status: 'Done' | 'Waiting to be done' | 'Ongoing'
}

const cookies = new Cookies()


const fetchEditTask: (tokens: Tokens, task: TaskInfo) => Promise<boolean> = async (tokens: Tokens, task: TaskInfo) =>  {
	
	const taskInput = {...task, status: task.status as unknown}
	
	switch (task.status) {
		case "Done":
			taskInput.status = 2
			break
		case "Ongoing":
			taskInput.status = 1
			break
		case "Waiting to be done":
			taskInput.status = 0
			break
	}
	
	const response  = await fetch(`http://${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/tasks`,{
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'AccessToken': tokens.access
		},
		body: JSON.stringify(taskInput)
	})
	
	switch (response.status) {
		case 200:
			return true
		default:
			return false
	}
}

const fetchDeleteTask = async (tokens: Tokens, id: string) => {
	const response = await fetch(`http://${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/tasks`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'AccessToken': tokens.access
		},
		body: JSON.stringify([{id: id}])
	})
	
	switch (response.status) {
		case 200:
			return true
		default:
			return false
	}
}
const TaskCard = (taskInfo: TaskInfo) => {
	
	const [statusState,setStatusState] = useState(taskInfo.status)
	
	
	const labelName = useRef<any>(null)
	const labelContent = useRef<HTMLParagraphElement>(null)
	
	const handleUpdate = async () => {
		const result = await fetchEditTask(cookies.get('todoAuthTokens'),
			{
				...taskInfo,
				name: labelName.current!.textContent!,
				content: labelContent.current!.textContent!,
				status: statusState
			})
		
		if(result) window.location.reload()
	};
	
	const handleDelete = async () => {
		const result = await fetchDeleteTask(cookies.get('todoAuthTokens'),
			taskInfo.id!)
		
		if (result) window.location.reload()
	};
	
	const setDone = () => {
		setStatusState('Done')
	}
	
	const setOngoing = () => {
		setStatusState('Ongoing')
	}
	
	const setWTB = () => {
		setStatusState('Waiting to be done')
	}
	
	// @ts-ignore
	return (
		<div className={"flex flex-col space-x-0.5 items-end"}>
			<div
				className={"flex flex-col items-center bg-white rounded-2xl text-black w-fit h-fit max-w-[100vh]"}>
				<div className={"w-full h-full p-2"}>
				<h1 className={'font-semibold text-2xl min-w-[25vh] w-full overflow-clip'} contentEditable={true}
				         ref={labelName}>
						{taskInfo.name}
					</h1>
					
					<p className={'min-w-[25vh] w-full overflow-clip'} contentEditable={true} ref={labelContent}>
						{taskInfo.content}
					</p>
				</div>
				
				<div className={"rounded-b-2xl p-2 space-x-3 w-full h-full flex bg-red-200"}>
					<button onClick={setDone} className={`font-semibold px-0.5 ${statusState === "Done" ? "bg-red-300" : ""}`}>Done</button>
					<div className={"min-h-full min-w-[2px] bg-red-400"}/>
					<button onClick={setOngoing}  className={`font-semibold px-0.5 ${statusState === "Ongoing" ? "bg-red-300" : ""}`}>Ongoing</button>
					<div className={"min-h-full min-w-[2px] bg-red-400"}/>
					<button onClick={setWTB} className={`font-semibold px-0.5 ${statusState === "Waiting to be done" ? "bg-red-300" : ""}`}>Waiting to be done</button>
				</div>
			</div>
			<div className={"space-x-0.5"}>
				<button className={'mt-2 h-[40px] w-[40px] bg-red-800 text-white rounded-full max-w-full overflow-clip'}
				        onClick={handleDelete}>X
				</button>
				<button className={'mt-2 h-[40px] w-[40px] bg-blue-500 text-white rounded-full max-w-full overflow-clip'}
				        onClick={handleUpdate}>Upd
				</button>
				
			</div>
		</div>
	);
};

const fetchAddCard: (tokens: Tokens, task: TaskInfo) => Promise<boolean> = async (tokens: Tokens, task: TaskInfo) =>  {
	
	const response  = await fetch(`http://${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/tasks`,{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'AccessToken': tokens.access
		},
		body: JSON.stringify(task)
	})
	
	switch (response.status) {
		case 200:
			return true
		default:
			return false
	}
}
export const NewTaskCard = () => {
	
	const labelName = useRef<any>(null)
	const labelContent = useRef<HTMLParagraphElement>(null)
	
	const handleAdd = async () => {
		if(!labelName.current!.textContent) {
			alert('Task name required!')
			return
		}
		
		if(!labelContent.current!.textContent) {
			alert('Task content required!')
			return
		}
		
		const result = await fetchAddCard(cookies.get('todoAuthTokens'),{
			name: labelName.current!.textContent,
			content: labelContent.current!.textContent,
			status: 'Waiting to be done'
		})
		
		if (result) window.location.reload()
	}
	
	return (
		<div className={"flex flex-col space-x-0.5 items-end"}>
			<div className={"flex flex-col items-center bg-neutral-300 rounded-2xl text-black w-fit h-fit p-2 max-w-[100vh]"}>
				<h1 className={'font-semibold text-2xl min-w-[25vh] w-full overflow-clip'} contentEditable={true} ref={labelName}>
					New task name...
				</h1>
				
				<p className={'min-w-[25vh] w-full overflow-clip'} contentEditable={true} ref={labelContent}>
					New task content...
				</p>
			</div>
			<div>
			<button className={'mt-2 h-[40px] w-[40px] bg-blue-500 text-white rounded-full max-w-full overflow-clip'}
			        onClick={handleAdd}>+
			</button>
			</div>
		</div>
	);
}

export default TaskCard;