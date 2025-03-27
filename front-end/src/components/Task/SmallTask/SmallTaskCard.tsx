import { useNavigate } from "react-router-dom";
import { TaskType } from "../../../api/types/Tasks/TaskTypes";
import ChartPie from "../../chart/ChartPie";
import "./SmallTask.style.scss";

export default function SmallTaskCard({task, navigateTo}:{task:TaskType, navigateTo?:string}){
    const navigate = useNavigate();

    const handleClickToTask = () => {
        if(navigateTo){
            navigate(navigateTo)
        } else {
            console.log("clicked!");
        }
    }

    const taskDate = new Date(task.date_to_complete);

    return (
        <>
            <div className="small_card" onClick={handleClickToTask}>
                <header className="small_card__header">
                    <div className={`small_card__header-difficulty ${task.difficulty_level}`}>
                        {task.difficulty_level.charAt(0).toUpperCase() + task.difficulty_level.slice(1)}
                    </div>
                    <div className="small_card__header-date">
                        To {taskDate.toLocaleDateString()}
                    </div>
                </header>
                <main className="small_card__main">
                    <div className="small_card__main-desc">
                        <h1>
                            {task.name}
                        </h1>
                        <p>
                            {task.description}
                        </p>
                    </div>
                    <div className="small_card__main-graph">
                        <ChartPie progress={Math.floor((100 * (task as any).completedsubtasks) / (task as any).subtasksnumber)}  />
                        <div className="graph__info">
                            <div className="graph__info-block completed">
                                <img src="/light/success2.svg" alt="" />
                                <h1>
                                    {(task as any).completedsubtasks}
                                </h1>
                                <h2>
                                    Completed
                                </h2>
                            </div>
                            <div className="graph__info-block process">
                                <img src="/light/loading.svg" alt="" />
                                <h1>
                                    {(task as any).subtasksnumber - (task as any).completedsubtasks}
                                </h1>
                                <h2>
                                    In process
                                </h2>
                            </div>
                        </div>
                    </div>
                    <footer className="small_card__main-footer">
                        <div className="footer__block">
                            <img src="/light/tasks.svg" alt="" />
                            <h1>
                                {(task as any).subtasksnumber}
                            </h1>
                            <h2>
                                SubTasks
                            </h2>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    )
}