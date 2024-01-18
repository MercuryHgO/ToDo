import prisma from "../prisma.js";

export type Task = {
	id: string
	name: string,
	content: string
	status: status
}
export type status = 0 | 1 | 2

export async function getUserTasks(userId: string): Promise<Task[]> {
	const tasks = await prisma.taskList.findMany({
		where: {
			userId: userId
		}
	})
	
	return tasks.map(
		(task): Task => {
			return {
				...task,
				status: task.status as status,
			}
		}
	)
}
export async function createUserTask(userId: string,name: string, content: string): Promise<Task> {
	const task = await prisma.taskList.create({
		data: {
			userId: userId,
			name: name,
			content: content,
			status: 0
		}
	})
	
	return {
		...task,
		status: task.status as status,
	}
}
export async function editUserTask(id: string, userId: string, name?: string, content?: string, status?: status): Promise<Task> {
	const task = await prisma.taskList.update(
		{
			where: {
				userId: userId,
				id: id
			},
			data: {
				name: name,
				content: content,
				status: status
			}
		}
	)
	
	return {
		...task,
		status: task.status as status
	}
}
export async function deleteUserTasks(data: {id: string}[]): Promise<void> {
	const deleteRequest = data.map(
		filer => {
			return prisma.taskList.delete({
				where: filer
			})
		}
	)
	
	await prisma.$transaction(deleteRequest).catch(e => {
		throw new Error(e)
	})
}
