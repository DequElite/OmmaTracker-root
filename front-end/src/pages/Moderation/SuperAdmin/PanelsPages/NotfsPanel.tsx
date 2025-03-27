import { useEffect, useState } from "react";
import Input from "../../../../components/Inputs/Input";
import useTitle from "../../../../hooks/useTitle";
import { useAppDispatch } from "../../../../store/store";
import { setMessageBox } from "../../../../store/Slices/messageBox.slice";
import { moderationApi, notificationApi } from "../../../../api/api";

export default function NotificationsPanel() {
    useTitle("Ommad | Notifications");

    const dispatch = useAppDispatch();
    const [isLoading,setIsLoading] = useState<boolean>(false);
    
    const [notfs, setNotfs] = useState([]);
    const [state, setState] = useState({
        title: "",
        message: ""
    });

    useEffect(()=>{
        const fetchNotfs = async () => {
            try{
                const response = await moderationApi.get('/get-all-notfs');
                setNotfs(response.data.notfs);
                console.log("resp: ", response);
            } catch (error){
                console.error("Error at fetchNotfs in users panel: ", error);
            }
        }

        fetchNotfs();
    },[])

    const handleDeleteNotf = async (index:number) => {
        try{
            const response = await moderationApi.delete('/delete-notf', {
                data: { id: (notfs[index] as any).id }
            });
            setNotfs(response.data.notfs);
            console.log("resp: ", response);
        } catch (error){
            console.error("Error at handleDeleteNotf: ", error);
        }
    }

    const handleInputChange = (name:string, value:string) => {
        setState(prevState=>({
            ...prevState,
            [name]:value
        }))
    }

    const PublishNotfs = async () => {
        setIsLoading(true);
        try {
            const response = await notificationApi.post('/global/send-notfs', {
                title:state.title,
                message: state.message
            });
            console.log(response);
            dispatch(
                setMessageBox({
                    type:'success',
                    description:'Published!',
                    isOpened:true,
                    duration: 5000
                })
            );
        } catch (error) {
            console.error("Error at publish: ", error);
            dispatch(
                setMessageBox({
                    type:'error',
                    description:'Oh shit, it`s not published!',
                    isOpened:true,
                    duration: 5000
                })
            )
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="notfspanels_container">
                <div className="notfspanel">
                    <header className="notfspanel__header">
                        <h1 className="notfspanel__header-text">
                            Global Notifications
                        </h1>
                        <button disabled={isLoading} className="notfspanel__header-publish" onClick={PublishNotfs}>
                            { isLoading ? "Loading..." : "Publish" } 
                        </button>
                    </header>
                    <main className="notfspanel__main">
                        <h1 className="notfspanel__main-head">
                            New global New notification
                        </h1>
                        <div className="notfspanel__main-field">
                            <Input 
                                model={state.title}
                                setChange={handleInputChange}
                                placeholder="Notification title"
                                type="text"
                                name="title"
                            />
                            <textarea 
                                value={state.message}
                                onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) =>
                                    handleInputChange(e.target.name, e.target.value)} 
                                placeholder="Notification description"
                                name="message"
                                className="w-[full] border-b-3 border-[#1E1E1E] p-3 font-bold focus:outline-none"
                            ></textarea>
                        </div>
                    </main>
                </div>
                <div className="allnotfs">
                    <header className="allnotfs__header">
                        <h1>
                            All notifications
                        </h1>
                    </header>
                    <main className="allnotfs__main">
                        <ul className="allnotfs__main-list">
                            {/* <li className="allnotfs__main-item" key={index}>
                                <div className="item__user">
                                    <img src="/light/green_bell.png" alt="" className="item__user-img"/>
                                    <div className="item__user-info">
                                        <h1>{el.username} | ID {el.id}</h1>
                                        <h2 className="blue">
                                            {el.email}
                                        </h2>
                                    </div>
                                </div>
                                <button className="item__delete" onClick={()=>handleDeleteNotf(index)}>Delete</button>
                            </li> */}
                            {
                                notfs && notfs.map((el:any, index)=>(
                                    <li className="allnotfs__main-item" key={index}>
                                        <div className="item__user">
                                            <img src="/light/green_bell.svg" alt="" className="item__user-img"/>
                                            <div className="item__user-info">
                                                <h1>{el.title} | ID {el.id}</h1>
                                                <h2 className="blue">
                                                    {el.created_at}
                                                </h2>
                                            </div>
                                        </div>
                                        <button className="item__delete" onClick={()=>handleDeleteNotf(index)}>Delete</button>
                                    </li>
                                ))
                            }
                        </ul>
                    </main>
                </div>
            </div>
        </>
    )
}