import { useEffect, useState } from "react";
import SmallTaskCard from "../../../components/Task/SmallTask/SmallTaskCard";
import { TaskType } from "../../../api/types/Tasks/TaskTypes";
import LoadingComponent from "../../../components/Loading/Loading";
import { dataApi } from "../../../api/api";

export default function CompletedTaskPage() {

    const [tasks, setTasks] = useState([
        
    ]);

    const [isLoadingServer, setIsLoadingServer] = useState<boolean>(true);
    const [isAvaibleServer, setIsAvaibleServer] = useState<boolean>(false);

    useEffect(()=>{
        const fetchUserTasksData = async () => {
            setIsLoadingServer(true);
            setIsAvaibleServer(false);
            try{
                const response = await dataApi.post('/tasks/all-tasks');
                console.log(response);

                const completedTasks = response.data.usertasks.filter((el:TaskType)=>el.subtasksnumber===el.completedsubtasks && new Date(el.date_to_complete) > new Date());
                setTasks(completedTasks);

                setIsLoadingServer(false);
                setIsAvaibleServer(true);
            } catch (error) {
                setIsLoadingServer(false);
                setIsAvaibleServer(false);
                console.log("Failed to load user tasks: ", error);
            }
        }

        fetchUserTasksData()
    },[])

    if(isLoadingServer && !isAvaibleServer ){
        return (
            <LoadingComponent loadingText="Load the tasks..." type="loading"/>
        )
    }

    if(tasks.length === 0 && !isLoadingServer && isAvaibleServer){
        return (
            <h1>
                You don't currently have any completed tasks :)
            </h1>
        )
    }

    return (
        <>
            {tasks.map((task) => (
                <SmallTaskCard key={(task as any).id} task={task} navigateTo={`review?task=${(task as any).id}`} />
            ))}
        </>
    );
}
