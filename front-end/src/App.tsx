import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.scss'
import Routers from './router/router'
import Header from './components/Header/header';
import { BaseStoreApi } from './store/StoreApi';
import store, { useAppDispatch, useAppSelector } from './store/store';
import { setIsOpened } from './store/Slices/messageBox.slice';
import MessageBox from './components/MessageBox/MessageBox';
import OmmadHeader from './components/Header/OmmadHeader';
import LoadingComponent from './components/Loading/Loading';
import { useEffect, useState } from 'react';
import{ authApi, notificationApi, ReturnAuthToken, SocketApiUrl } from './api/api';
import useQuery from './hooks/useQuery';
import Notifications from './components/Main/Notifications/Notifications';
import { io } from 'socket.io-client';
import { addNotification, NotfsType } from './store/Slices/notifications.slice';

const socket = io(SocketApiUrl, {
  path: '/omma/socket.io',
  auth: {
    token: ReturnAuthToken()
  }
});

function Layout() {
  const dispatch = useAppDispatch();
  const messageBoxState = useAppSelector((state) => state.messageBox);
  const notifications = useAppSelector(state => state.notifications.notifications);

  const [newNotification, setNewNotification] = useState(false);

  const query = useQuery(); 
  console.log(query)

  const location = useLocation();

  const fetchUnReadNotfs = async () => {
    try {
      const response = await notificationApi.get('/global/get-notfs');
      const data = await response.data;
      console.log("fetchUnReadNotfs data: ", response);
  
      const existingNotfs = store.getState().notifications.notifications;
  
      data.forEach((notif: NotfsType) => {
        const isDuplicate = existingNotfs.some((existing: NotfsType) => existing.id === notif.id);
        if (!isDuplicate) {
          dispatch(addNotification(notif));
        }
      });
  
      if (data.length > 0) {
        setNewNotification(true);
      }
    } catch (error) {
      console.error("Error at fetchNotfs: ", error);
    }
  };

  const fetchPersonalUnReadNotfs = async () => {
    try {
      const response = await notificationApi.get('/global/get-personal-notfs');
      const data = await response.data;
      console.log("fetchUnReadNotfs data: ", response);
  
      const existingNotfs = store.getState().notifications.notifications;
  
      data.forEach((notif: NotfsType) => {
        const isDuplicate = existingNotfs.some((existing: NotfsType) => existing.id === notif.id);
        if (!isDuplicate) {
          dispatch(addNotification(notif));
        }
      });
  
      if (data.length > 0) {
        setNewNotification(true);
      }
    } catch (error) {
      console.error("Error at fetchNotfs: ", error);
    }
  };
  
  useEffect(() => {
    fetchUnReadNotfs();
    fetchPersonalUnReadNotfs();

    socket.on("socket_id", (id: string) => {
        console.log("Socket ID received:", id);
    });
    socket.on("connect", () => {
      console.log("Socket connected: ", socket.id);
    });
    socket.on("new_global_notification", (newNotfs: NotfsType) => {
      console.log("new_global_notification: ", newNotfs);
      dispatch(
        addNotification(newNotfs)
      );
      setNewNotification(true); 
    });

    return () => {
      socket.off("new_global_notification");
      socket.off("socket_id");
    };
  }, [dispatch]);

  useEffect(()=>{
    const isUnReadNotfs = notifications.some(notf=>!notf.is_read);
    setNewNotification(isUnReadNotfs);
  },[notifications])

  const handleCloseMessageBox = () => {
    dispatch(
      setIsOpened(false)
    )
  }

  return (
    <>
      {
        location.pathname !== '/home' 
        && !location.pathname.startsWith("/register") 
        && !location.pathname.startsWith('/moderation') 
        ? <Header newNotification={newNotification}/> 
        : location.pathname.startsWith('/moderation') && <OmmadHeader />
      }
      <main>
        { 
          messageBoxState.isOpened && 
          <MessageBox
            type={messageBoxState.type}
            description={messageBoxState.description}
            duration={messageBoxState.duration}
            onClose={handleCloseMessageBox}
          />
        }

        {
          query.get("is_notfs") == "open" && <Notifications/>
        }

        <Routers />
      </main>
    </>
  );
}

function App() {

  const { isLoading } = BaseStoreApi.useFetchProfileUserQuery();
  const adminLoading = BaseStoreApi.useFetchAdminQuery();
  const [isLoadingServer, setIsLoadingServer] = useState<boolean>(true);
  const [isAvaibleServer, setIsAvaibleServer] = useState<boolean>(false);
  const [isErrorServer, setIsErrorServer] = useState<boolean>(false);

  // const fetchNotfs = async (dispatch: AppDispatch, getState: any) => {
  //   try {
  //       const response = await api.get('/notifications/global/get-notfs');
  //       const data = await response.data;
  //       console.log("fetchNotfs data: ", response);
  
  //       const existingNotfs = getState().notifications.notifications; 
  
  //       data.forEach((notif: NotfsType) => {
  //           const isDuplicate = existingNotfs.some((existing: NotfsType) => existing.id === notif.id);
  //           if (!isDuplicate) {
  //               dispatch(addNotification(notif));
  //           }
  //       });
  //   } catch (error) {
  //       console.error("Error at fetchNotfs: ", error);
  //   }
  // };

  // useEffect(() => {
  //     fetchNotfs(dispatch, store.getState);
  // }, [dispatch]);

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("Socket connected: ", socket.id);
  //   });
  //   socket.on("new_global_notification", (newNotfs: NotfsType) => {
  //     console.log("new_global_notification: ", newNotfs);
  //     dispatch(
  //       addNotification(newNotfs)
  //     );
  //     setNewNotification(true); 
  //   });

  //   return () => {
  //     socket.off("new_global_notification");
  //   };
  // }, [dispatch]);

  console.log('isLoading:', isLoading , adminLoading.isLoading);
  useEffect(()=>{
    const fetchIsServerAvaible = async () => {
      setIsLoadingServer(true);
      setIsErrorServer(false)
      try {
        const repsonse = await authApi.get('/check-is-server-avaible');
        if(repsonse.status === 200){
          setIsLoadingServer(false);
          setIsAvaibleServer(true);
          setIsErrorServer(false)
        }
      } catch (error){
        setIsLoadingServer(false);
        setIsAvaibleServer(false);
        setIsErrorServer(true)
        console.error("Erro at load server: ", error)
      }
    }

    fetchIsServerAvaible()
  },[])

  return (
    <Router>
      <Routes>
        {
          !isLoadingServer && isAvaibleServer
          ? <Route path="*" element={<Layout />} />
          : <Route path='*' element={
            <div style={{height:'100vh'}}>
              <LoadingComponent loadingText={isLoadingServer && !isErrorServer ? 'Loading site...' : 'Server does not avaible now :('} type={isLoadingServer && !isErrorServer ? 'loading' : 'error'}/>
            </div>
          } />
        }

      </Routes>
    </Router>
  );
}

export default App;
