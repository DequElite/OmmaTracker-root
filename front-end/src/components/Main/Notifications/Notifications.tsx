import { useNavigate } from "react-router-dom"
import useTitle from "../../../hooks/useTitle"
import "./style.scss"
import { useEffect } from "react";
import { markNotificationAsRead, NotfsType } from "../../../store/Slices/notifications.slice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { notificationApi } from "../../../api/api";

export default function Notifications(){
    useTitle("Omma | Notifications")

    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const notifications = useAppSelector(state => state.notifications.notifications);

    useEffect(() => {
        // Логика для перерисовки компонента, если нужно
        console.log("Notifications state has changed:", notifications);
     }, [notifications]);
     

    // const fetchNotfs = async () => {
    //     try {
    //         const response = await api.get('/notifications/global/get-notfs');
    //         const data = await response.data;
    //         data.forEach((notif: NotfsType) => {
    //             dispatch(addNotification(notif));
    //         });
    //         console.log("fetchNotfs data: ", response);
    //     } catch (error) {
    //         console.error("Error at fetchNotfs: ", error);
    //     }
    // };

    // useEffect(()=>{
    //     fetchNotfs();
    // }, [])

    const MarkAsReadNotfs = async (notfsId:number) => {
        try {
            const response = await notificationApi.post('/global/mark-as-read', { notfsID:notfsId });
            console.log("response at MarkAsReadNotfs: ", response);
            dispatch(
                markNotificationAsRead(notfsId)
            )
        } catch (error){
            console.error("Eror at MarkAsReadNotfs: ", error);
        }
    }

    return (
        <>
            <div className="notfs_container">
                <div className="notfs">
                    <header className="notfs__header">
                        <h1>
                            Notifications
                        </h1>
                        <button onClick={()=>navigate("?is_notfs=close")} className="cursor-pointer">
                            <img src="/light/close.svg" alt="" />
                        </button>
                    </header>
                    <main className="notfs__main">
                        <ul className="notfs__main-list">
                            {
                                notifications.length > 0 ? (
                                    notifications.map((el: NotfsType, index) => {
                                      if(!el.is_read){
                                        return (
                                            <li className="notfs__main-item" key={index}>
                                              <div className="item__head">
                                                <div className="item__head-title">
                                                  {
                                                    el.is_global ? <img src="/light/global.svg" alt="" /> : <img src="/light/personal.svg" alt="" />
                                                  }
                                                  {/* <img src="/light/red-bell.png" alt="" /> */}
                                                  <h2>{el.title}</h2>
                                                  {/* <img src="/light/global.svg" alt="" /> */}
                                                </div>
                                                <div className="item__head-date">
                                                    <strong>{new Date(el.created_at).toLocaleString()}</strong>
                                                </div>
                                              </div>
                                              <section className="item__section">
                                                <div className="item__section-message">
                                                  {el.message}
                                                </div>
                                                <div className="item__section-button">
                                                  <button onClick={() => MarkAsReadNotfs(el.id)}>
                                                    Mark as read
                                                  </button>
                                                </div>
                                              </section>
                                            </li>
                                          );
                                      }
                                    })
                                  ) : (
                                    <p className="no-notfs">
                                      No notifications yet :)
                                    </p>
                                  )
                                  
                            }
                        </ul>
                    </main>
                </div>
            </div>
        </>
    )
}