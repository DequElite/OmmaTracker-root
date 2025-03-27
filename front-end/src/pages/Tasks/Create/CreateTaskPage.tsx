import { useNavigate } from "react-router-dom";
import "./style.scss";
import Input from "../../../components/Inputs/Input";
import { useEffect, useState } from "react";
import { SubTaskType, TaskType } from "../../../api/types/Tasks/TaskTypes";
import { useAppDispatch } from "../../../store/store";
import { setMessageBox } from "../../../store/Slices/messageBox.slice";
import { dataApi } from "../../../api/api";

export default function CreateTaskPage(){
    const navigate = useNavigate();
    const dispatch = useAppDispatch()

    const [TaskState, SetTaskState] = useState<TaskType>({
        id: 3,
        user_id: 2,
        difficulty_level: 'medium',
        name:'',
        description:'',
        date_to_complete: new Date(),
        subtasksnumber:0,
        completedsubtasks:0 
    })

    const [SubTasksState, SetSubTasksState] = useState<SubTaskType[]>([]);

    useEffect(()=>{
        console.log('TaskState: ', TaskState);
        console.log('subTasksState: ', SubTasksState);
    },[TaskState, SubTasksState])

    const handleChangeTaskState = (name: string, value: string | number | Date) => {
        SetTaskState(prevState => ({
            ...prevState,
            [name]: name === "date_to_complete" ? new Date(value) :
                    ["subTasksNumber", "completedSubTasks"].includes(name) ? Number(value) :
                    value
        }));
    };
    

    const handleAddSubTask = () => {
        if (SubTasksState.length >= 15) {
            dispatch(
                setMessageBox({
                    type:'error',
                    description: 'Maximum number of Sub tasks reached',
                    duration:5000,
                    isOpened:true
                })
            )
            return;
        };
        SetTaskState(prevState=>({
            ...prevState,
            subTasksNumber:SubTasksState.length + 1
        }))
        SetSubTasksState(prevState => [
            ...prevState,
            {
                id: prevState.length + 1, 
                task_id: TaskState.id,
                text: prevState.length + 1 + "." + "SubTask",
                is_completed: false
            }
        ]);
    };
    
    const handleChangeSubTaskData = (name:string, value:string, index:number) => {
        SetSubTasksState(prevState=>
            prevState.map((subtask, i) => 
                i === index ? {...subtask, [name]:value} : subtask
            )
        );
    }

    const handleDeleteSubTask = (index:number) => {
        SetSubTasksState(prevState => prevState.filter((_, i)=>i!==index))
    }

    const CreateTask = async () => {
        try{
            const filteredSubTasks = SubTasksState
                .filter(subtask => subtask.text.trim() !== "")
                .map(({ task_id, id, is_completed, ...rest }) => rest); 

            const response = await dataApi.post('/tasks/create', {
                TaskData: {
                    difficulty_level: TaskState.difficulty_level,
                    name: TaskState.name,
                    description: TaskState.description,
                    date_to_complete: TaskState.date_to_complete,
                    subTasksNumber: TaskState.subtasksnumber
                },
                SubTasksList:filteredSubTasks
            });

            console.log('CreateTask Reaponse: ', response);
            if(response.status === 200){
                dispatch(
                    setMessageBox({
                        type:'success',
                        description: 'Your task has been successfully created',
                        duration:6000,
                        isOpened:true
                    })
                )
            }
        } catch (error){
            console.error("Error at CreatteTAsk: ", error);
            dispatch(
                setMessageBox({
                    type:'error',
                    description: 'Error in creating a task. Try again later',
                    duration:6000,
                    isOpened:true
                })
            )
        }
    }

    return (
        <>
            <div className="create_task">
                <header className="create_task__header">
                    <div className="create_task__header-title">
                        <h1 className="create_task__header-title-text">
                            Create Task
                        </h1>
                        <button className="create_task__header-title-create" onClick={CreateTask}>
                            Create Task
                        </button>
                    </div>
                    <div className="create_task__header-close">
                        <button onClick={()=>navigate("/dashboard/tasks")} className="cursor-pointer">
                            <img src="/light/close.svg" alt="" />
                        </button>
                    </div>
                </header>
                <main className="create_task__main">
                    <div className="create_task__main-name">
                        <Input 
                            model={TaskState.name}
                            setChange={handleChangeTaskState}
                            placeholder="Task name"
                            type="text"
                            name="name"
                        />
                    </div>
                    <div className="create_task__main-type">
                        <select 
                            value={TaskState.difficulty_level} 
                            onChange={(e:React.ChangeEvent<HTMLSelectElement>) =>
                                        handleChangeTaskState(e.target.name, e.target.value)} 
                            name="difficulty_level"
                            className="w-[30%] h-12 border-b-3 border-[#1E1E1E] p-3 font-bold focus:outline-none"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                        <div className={`${TaskState.difficulty_level}`}>
                            {TaskState.difficulty_level}
                        </div>
                    </div>
                </main>
                <div className="create_task__details">
                    <div className="create_task__details-desc">
                        <textarea 
                            value={TaskState.description} 
                            placeholder="Task description" 
                            onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) =>
                                handleChangeTaskState(e.target.name, e.target.value)} 
                            name="description"
                            className="w-[full] border-b-3 border-[#1E1E1E] p-3 font-bold focus:outline-none"
                        ></textarea>
                    </div>
                    <div className="create_task__details-date">
                        <h2>
                            Date to complete
                        </h2>
                        <Input 
                            model={TaskState.date_to_complete.toISOString().split("T")[0]}
                            setChange={handleChangeTaskState}
                            placeholder="Day to complete"
                            type="date"
                            name="date_to_complete"
                        />
                    </div>
                </div>
                <div className="create_task__subtasks">
                    <h1>
                        Sub tasks
                    </h1>
                    <div className="create_task__subtasks-editor">
                        {
                            SubTasksState.map((subtask, index)=>(
                                <div className="subtask" key={index}>
                                    <Input 
                                        model={subtask.text}
                                        setChange={(name:string, value:string)=>handleChangeSubTaskData(name, value, index)}
                                        name="text"
                                    />
                                    <button className="subtask__delete cursor-pointer w-[4vh] h-[4vh]" onClick={()=>handleDeleteSubTask(index)}>
                                        <img src="/light/trash.svg" alt="" />
                                    </button>
                                </div>
                            ))
                        }
                        <button 
                            className="w-[100%] h-[5vh] rounded-lg border-2 border-dashed border-[#002185] text-[#FFFFFF] cursor-pointer font-bold hover:border-0"  
                            style={{ backgroundColor: "rgba(31, 74, 205, 0.5)" }}
                            onClick={handleAddSubTask}
                        >
                            Add new
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}