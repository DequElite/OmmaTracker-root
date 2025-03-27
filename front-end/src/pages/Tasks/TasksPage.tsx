import { Link } from "react-router-dom";
import "./style.scss";
import useQuery from "../../hooks/useQuery";
import { JSX, useEffect, useRef, useState } from "react";
import InTheProgressTask from "./InTheProgress/InTheProgressTask";
import CompletedTaskPage from "./Completed/CompletedTaskPage";
import ExpiredTaskPage from "./Expired/ExpiredTaskPage";
import useTitle from "../../hooks/useTitle";

const TASKS: Record<string, JSX.Element> = {
    ['completed']: <CompletedTaskPage />,
    ['intheprogress']: <InTheProgressTask />,
    ['expired']: <ExpiredTaskPage />
}

export default function TasksPage(){
    useTitle("Omma | Tasks")

    const locationQuery = useQuery();
    const [tableTypeState, setTableTypeState] = useState('');

    const [linePosition, setLinePosition] = useState(0);
    const [lineWidth, setLineWidth] = useState(0);
    const linksRef = useRef<{ [key: string]: HTMLAnchorElement | null }>({
        completed: null,
        intheprogress: null,
        expired: null
    });

    useEffect(()=>{
        setTableTypeState(locationQuery.get("table") as string);
    }, [locationQuery])

    useEffect(() => {
        const updateLinePosition = () => {
            if (linksRef.current[tableTypeState]) {
                const linkElement = linksRef.current[tableTypeState];
                if (linkElement) {
                    const rect = linkElement.getBoundingClientRect();
                    const parentElement = linkElement.parentElement; 
                    //@ts-ignore
                    const parentRect = parentElement.getBoundingClientRect();
                    const offsetLeft = rect.left - parentRect.left; 
    
                    setLineWidth(rect.width); 
                    setLinePosition(offsetLeft);
                }
            }
        };
    
        requestAnimationFrame(updateLinePosition);
    
        window.addEventListener("resize", updateLinePosition);
        return () => window.removeEventListener("resize", updateLinePosition);
    }, [tableTypeState]);


    return  (
        <>
            <div className="tasks">
                <aside className="tasks__sidebar">
                    <div className="tasks__sidebar-link">
                        <div className="link__img">
                            <img src="/light/light_graph.png" alt="" />
                        </div>
                        <div className="link__content">
                            <h1 className="link__content-header">
                                Tasks
                            </h1>
                            <h3 className="link__content-text red">
                                Omma
                            </h3>
                        </div>
                    </div>
                </aside>
                <div className="tasks__content">
                    <header className="tasks__header">
                        <nav className="tasks__header-nav">
                            <ul className="tasks__header-list">
                                <li className="tasks__header-item" ref={(el:any) => linksRef.current["completed"] = el}>
                                    <img src="/success.svg" alt="" />
                                    <Link to="?table=completed">Completed</Link>
                                </li>
                                <li className="tasks__header-item" ref={(el:any) => linksRef.current["intheprogress"] = el}>
                                    <img src="/loading.svg" alt="" />
                                    <Link to="?table=intheprogress">In the progress</Link>
                                </li>
                                <li className="tasks__header-item" ref={(el:any) => linksRef.current["expired"] = el}>
                                    <img src="/expired.svg" alt="" />
                                    <Link to="?table=expired">Expired</Link>
                                </li>
                            </ul>
                        </nav>
                        <div className="tasks__header-line">
                        <div
                                className="tasks__header-sub_line"
                                style={{
                                    left: `${linePosition}px`,
                                    width: `${lineWidth}px`, // установка ширины линии
                                }}
                            ></div>
                        </div>
                    </header>
                    <main className="tasks__main">
                        {
                            tableTypeState === null ? TASKS['intheprogress'] : TASKS[tableTypeState]
                        }
                    </main>
                </div>
            </div>
        </>
    )
}