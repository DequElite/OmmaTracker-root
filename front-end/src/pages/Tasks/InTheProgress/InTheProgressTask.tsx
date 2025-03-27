import { useEffect, useState } from "react";
import SmallTaskCard from "../../../components/Task/SmallTask/SmallTaskCard";
import { TaskType } from "../../../api/types/Tasks/TaskTypes";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../../components/Loading/Loading";
import { dataApi } from "../../../api/api";

export default function InTheProgressTask() {
    const navigate = useNavigate();

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

                const progressTasks = response.data.usertasks.filter((el:TaskType)=>el.subtasksnumber>el.completedsubtasks && new Date(el.date_to_complete) > new Date());
                setTasks(progressTasks);

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
    

    return (
        <>
            {tasks.map((task) => (
                <SmallTaskCard key={(task as any).id} task={task} navigateTo={`review?task=${(task as any).id}`} />
            ))}
            <button 
                className="w-[23%] h-[5vh] rounded-lg border-2 border-dashed border-[#002185] text-[#FFFFFF] cursor-pointer font-bold hover:border-0"  
                style={{ backgroundColor: "rgba(31, 74, 205, 0.5)" }}
                onClick={()=>navigate('create')}
            >
                Add new
            </button>
        </>
    );
}
