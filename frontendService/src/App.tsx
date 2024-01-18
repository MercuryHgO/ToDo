import './App.css'
import Header from "./Header/Header.tsx";
import React, {useEffect, useState} from "react";
import RegisterScreen from "./RegisterScreen.tsx";
import TaskCard, {NewTaskCard, TaskInfo} from "./TaskCard.tsx";
import Cookies from "universal-cookie";

export type Tokens = {
    access: string,
    refresh: string
}

export const Context = React.createContext<any>(false)

const cookies = new Cookies()

const fetchAuthInfo = async (tokens: Tokens): Promise<boolean> => {
    const fetchAuthInfoRefresh = fetch(`http://${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/user/signin`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'AccessToken': tokens?.access!
        }
    })
    
    const data = await fetch(`http://${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/user/signin`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'AccessToken': tokens?.access!
        }
    })
    
    switch (data.status) {
        case 200:
            return true
        default:
        {
            const data = await fetchAuthInfoRefresh
            switch (data.status) {
                case 200:
                    const access: Tokens = await data.json()
                    cookies.set('todoAuthTokens',access)
                    return true
                default:
                    cookies.remove('todoAuthTokens')
                    return false
            }
        }
    }
}


const fetchTasks = async (tokens: Tokens, setTaskList: React.Dispatch<React.SetStateAction<(TaskInfo & {id: string})[]>>)=> {
    const responce  = await fetch(`http://${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/tasks`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'AccessToken': tokens.access
        }
    })
    
    const tasksResponce = await responce.json()
    
    
    const taskStatus = (status: number) => {
        switch (status){
            case 0:
                return 'Waiting to be done'
            case 1:
                return 'Ongoing'
            case 2:
                return 'Done'
        }
    }
    
    const tasks = tasksResponce.map(
        (task: TaskInfo & {id: string})  => {
            return {
                ...task,
                status: taskStatus(task.status as unknown as number)
            }
        }
    )
    
   setTaskList(tasks)
}

const App = () => {
    const [registerScreen, setRegisterScreen] = useState(false)
    const [loggedIn,setLoggedIn] = useState(false)
    
    const [taskList, setTaskList] = useState<(TaskInfo & {id: string})[]>([])
    
   useEffect(
       () => {
           
           const tokens: Tokens | undefined = cookies.get('todoAuthTokens')
           
           if (!tokens) return
           
           fetchAuthInfo(tokens)
                .then(
                    async (value) => {
                        if(!value) {
                            setLoggedIn(false)
                            return
                        }
                        
                        setLoggedIn(true)
                        
                        await fetchTasks(tokens,setTaskList)
                        
                        return
                    }
                )
           
       },
       []
   )
   
  return (
    <Context.Provider value={[registerScreen,setRegisterScreen,loggedIn]}>
        <RegisterScreen />
        <Header />
        <main className={"flex justify-start items-start flex-wrap gap-2 p-2"}>
            {
                taskList.map(
                    task => {
                        return <TaskCard key={task.id} id={task.id} name={task.name} content={task.content} status={task.status}/>
                    }
                )
            }
            {
                loggedIn ?
                    <NewTaskCard />
                    :
                    null
            }
        </main>
    </Context.Provider>
  )
};

export default App
