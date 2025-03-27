import { JSX, useEffect, useState } from "react";
import UsersPanel from "./PanelsPages/UsersPanel";
import NotificationsPanel from "./PanelsPages/NotfsPanel";
import useQuery from "../../../hooks/useQuery";
import { Link } from "react-router-dom";

const PANELS: Record<string, JSX.Element> = {
    ['users']:<UsersPanel />,
    ['notifications']:<NotificationsPanel />
}

export default function LairSA(){

    const locationQuery = useQuery();
    const [panelState, setPanelState] = useState('');

    useEffect(()=>{
        setPanelState(locationQuery.get("panel") as string);
        console.log(panelState)
    },[locationQuery])

    return (
        <>
            <div className="lair">
                <aside className="lair__sidebar">
                    <Link to='?panel=users' className="lair__sidebar-link">
                        <div className="link__img">
                            <img src="/light/users.png" alt="" />
                        </div>
                        <div className="link__content">
                            <h1 className="link__content-header">
                                Users
                            </h1>
                            <h3 className="link__content-text blue">
                                Omma
                            </h3>
                        </div>
                    </Link>
                    <Link to='?panel=notifications' className="lair__sidebar-link">
                        <div className="link__img">
                            <img src="/light/green_bell.svg" alt="" />
                        </div>
                        <div className="link__content">
                            <h1 className="link__content-header">
                                Notfs.
                            </h1>
                            <h3 className="link__content-text green">
                                Global
                            </h3>
                        </div>
                    </Link>
                </aside>
                <main className="lair__main">
                    {
                        PANELS[panelState]
                    }
                </main>
            </div>
        </>
    )
}