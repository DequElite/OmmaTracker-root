import { useNavigate } from "react-router-dom";
import useQuery from "../../../hooks/useQuery";
import "./style.scss";
import ChartPie from "../../../components/chart/ChartPie";
import { SubTaskType, TaskType } from "../../../api/types/Tasks/TaskTypes";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../store/store";
import { setMessageBox } from "../../../store/Slices/messageBox.slice";
import LoadingComponent from "../../../components/Loading/Loading";
import { dataApi } from "../../../api/api";

export default function ReviewTaskPage(){
    const locationQuery = useQuery()
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [TaskState, SetTaskState] = useState<TaskType | null>(null);

    const [SubTasksState, SetSubTasksState] = useState<SubTaskType[]>([]);

    const initialSubTasksState = useRef<SubTaskType[]>([]);

    const [isLoadingServer, setIsLoadingServer] = useState<boolean>(true);
    const [isAvaibleServer, setIsAvaibleServer] = useState<boolean>(false);

    useEffect(()=>{
        const fetchUserTasksData = async () => {
            setIsLoadingServer(true);
            setIsAvaibleServer(false);
            try{
                const response = await dataApi.post('/tasks/once-task', {taskid: Number(locationQuery.get("task")) });
                console.log(response);
                SetTaskState(response.data.Task);
                SetSubTasksState(response.data.SubTasks);

                initialSubTasksState.current = response.data.SubTasks;
                console.log("initialSubTasksState.current: ", initialSubTasksState.current)

                setIsLoadingServer(false);
                setIsAvaibleServer(true);
            } catch (error) {
                setIsLoadingServer(false);
                setIsAvaibleServer(false);
                console.log("Failed to load user tasks: ", error);

                const errorStatus = (error as any).response.status;

                switch (errorStatus) {
                    case 404: 
                        dispatch(
                            setMessageBox({
                                type:'error',
                                description:'Task not found',
                                isOpened:true,
                                duration: 5000
                            })
                        );
                        return;
                    case 403:
                        dispatch(
                            setMessageBox({
                                type:'error',
                                description:'This task is the task of another account',
                                isOpened:true,
                                duration: 7000
                            })
                        )
                        navigate('/dashboard/tasks');
                        return;
                }
            }
        }

        fetchUserTasksData()
    },[])

    useEffect(() => {
        console.log("Updated SubTasksState:", SubTasksState);
        console.log("Updated TaskState:", TaskState);
    }, [SubTasksState, TaskState]);
    

    useEffect(() => {
        if (SubTasksState.length > 0) {
            const completed = SubTasksState.filter((el) => el.is_completed).length;
            SetTaskState(prevState => {
                if (!prevState) return null;
                return {
                    ...prevState,
                    completedsubtasks: completed
                };
            });
        }
    }, [SubTasksState]); 
    
    const handleChangeSubTaskState = (subTaskIndex: number) => {
        SetSubTasksState(prevState => {
            const updatedSubTasks = prevState.map((subtask, index) =>
                index === subTaskIndex
                    ? { ...subtask, is_completed: !subtask.is_completed }
                    : subtask
            );
            return updatedSubTasks;
        });
    };
    
    const handleDeleteTask = async () => {
        try{
            const response = await dataApi.delete('/tasks/delete-task', {data:{
                taskid:TaskState?.id
            }});
            console.log(response);
            if(response.status === 200){
                dispatch(
                    setMessageBox({
                        type:'success',
                        description:'Task deleted success',
                        isOpened:true,
                        duration: 5000
                    })
                )
            }
        } catch (error) {
            console.log("Failed to load user tasks: ", error);

            const errorStatus = (error as any).response.status;

            switch (errorStatus) {
                case 404: 
                    dispatch(
                        setMessageBox({
                            type:'error',
                            description:'Task not found',
                            isOpened:true,
                            duration: 5000
                        })
                    );
                    return;
                case 403:
                    dispatch(
                        setMessageBox({
                            type:'error',
                            description:'This task is the task of another account',
                            isOpened:true,
                            duration: 7000
                        })
                    )
                    navigate('/dashboard/tasks');
            }
        }
    }

    const ChangeSubTasksData = async (changedSubTasks:SubTaskType[]) => {
        try{
            const response = await dataApi.put('/tasks/update-subtasks', {
                taskid:TaskState?.id,
                subtasks: changedSubTasks,
                completed_length: TaskState?.completedsubtasks
            })
            console.log(response);
            if(response.status === 200){
                dispatch(
                    setMessageBox({
                        type:'success',
                        description:'Sub tasks updated success',
                        isOpened:true,
                        duration: 5000
                    })
                )
            }
        }catch (error) {
            console.log("Failed to load user tasks: ", error);

            const errorStatus = (error as any).response.status;

            switch (errorStatus) {
                case 404: 
                    dispatch(
                        setMessageBox({
                            type:'error',
                            description:'Task not found',
                            isOpened:true,
                            duration: 5000
                        })
                    );
                    return;
                case 403:
                    dispatch(
                        setMessageBox({
                            type:'error',
                            description:'This task is the task of another account',
                            isOpened:true,
                            duration: 7000
                        })
                    )
                    navigate('/dashboard/tasks');
            }
        }
    }

    const handleClose = () => {
        const changedSubTasks = SubTasksState.filter((subtask, index)=>{
            return subtask.is_completed !== initialSubTasksState.current[index].is_completed
        })

        console.log('Changed sub tasks: ', changedSubTasks)

        if(changedSubTasks.length > 0) {
            ChangeSubTasksData(changedSubTasks);
        }

        navigate("/dashboard/tasks")
    }

    let taskDate;
    
    if(TaskState){
        taskDate = new Date((TaskState as any).date_to_complete);
    }

    if(isLoadingServer && !isAvaibleServer ){
        return (
            <LoadingComponent loadingText="Load the tasks..." type="loading"/>
        )
    }
    

    if(TaskState && !isLoadingServer && isAvaibleServer)
    return (
        <>
            <div className="review_task">
                <header className="review_task__header">
                    <div className="review_task__header-title">
                        <h1 className="review_task__header-title-text">
                            {TaskState.name}
                        </h1>
                        <button onClick={handleDeleteTask} className="review_task__header-title-delete cursor-pointer">
                            <img src="/light/trash.svg" alt="" />
                        </button>
                    </div>
                    <div className="review_task__header-close">
                        <button onClick={handleClose} className="cursor-pointer">
                            <img src="/light/close.svg" alt="" />
                        </button>
                    </div>
                </header>
                <div className="review_task__details">
                    <div className="review_task__details-type">
                        <h3>
                            {taskDate?.toLocaleDateString()}
                        </h3>
                        <div className={`${TaskState.difficulty_level}`}>
                            {TaskState.difficulty_level}
                        </div>
                    </div>
                    <div className="review_task__details-info">
                        <img src="/light/tasks.svg" alt="" />
                        <h1>
                            {TaskState.subtasksnumber}
                        </h1>
                        <h2>
                            SubTasks
                        </h2>
                    </div>
                </div>
                <div className="review_task__desc">
                    <p>
                        {TaskState.description}
                    </p>
                </div>
                <div className="review_task__subtasks">
                    <div className="review_task__subtasks-desc">
                        <h1>
                            Sub tasks
                        </h1>
                        <div className="review_task__subtasks-desc-tasks">
                            {SubTasksState.map((el, index)=>(
                                <div key={index} className={`subtask ${el.is_completed ? "checked" : "non-checked"}`}>
                                    <input type="checkbox" name="" id="" checked={el.is_completed} onChange={()=>handleChangeSubTaskState(index)}/>
                                    <h1>
                                        {el.text}
                                    </h1>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="review_task__subtasks-graph">
                        <div className="graph">
                            <ChartPie progress={Math.floor((100 * TaskState.completedsubtasks) / TaskState.subtasksnumber)} width={17} height={17} border={60} fontSize={18}/>
                        </div>
                        <div className="graph__desc">
                            <div className="graph__desc-completed">
                                <img src="/light/success2.svg" alt="" />
                                <h1>
                                    {TaskState.completedsubtasks}
                                </h1>
                                <h2>
                                    Completed
                                </h2>
                            </div>
                            <div className="graph__desc-process">
                                <img src="/light/loading.svg" alt="" />
                                <h1>
                                    {TaskState.subtasksnumber - TaskState.completedsubtasks}
                                </h1>
                                <h2>
                                    In process
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}