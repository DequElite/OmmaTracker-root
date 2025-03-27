// import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// const APP_MODE = import.meta.env.VITE_DEV_MODE || "DEV";
// // export const SocketApiUrl = APP_MODE === "DEV" ? 'http://localhost:7003' : "https://api-ommatracker-fullcoded.onrender.com";
// // //@ts-ignore
// // export const BaseApiUrl = APP_MODE === "DEV" ? 'http://localhost:7003/api' : "https://api-ommatracker-fullcoded.onrender.com/api";

// export const AuthApiUrl = "http://localhost:5001/api";
// export const DataApiUrl = "http://localhost:5002/api";
// export const ModerationApiUrl = "http://localhost:5003/api";
// export const NotificationApiUrl = "http://localhost:5004/api";
// export const RegisterApiUrl = "http://localhost:5005/api";
// export const SocketApiUrl = "http://localhost:5006"; 


// export const ReturnAuthToken = () => localStorage.getItem('accessToken');
// export const ReturnAdminToken = () => localStorage.getItem('accessSAToken');

// const api: AxiosInstance = axios.create({
//     baseURL:BaseApiUrl,
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     withCredentials: true,
//     timeout: 35000
// });

// api.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//         const token = ReturnAuthToken();
//         const adminToken = ReturnAdminToken();

//         if(token){
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }

//         if (adminToken) {
//             config.headers['Admin-Authorization'] = `Bearer ${adminToken}`;
//         }
        
//         return config;
//     }, 
//     (error)=>{
//         return Promise.reject(error);
//     }
// )

// export default api;

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const APP_MODE = import.meta.env.VITE_DEV_MODE || "DEV";

// export const AuthApiUrl = "http://localhost:5001/api";
// export const DataApiUrl = "http://localhost:5002/api";
// export const ModerationApiUrl = "http://localhost:5003/api";
// export const NotificationApiUrl = "http://localhost:5004/api";
// export const RegisterApiUrl = "http://localhost:5005/api";
// export const SocketApiUrl = "http://localhost:5006";

export const AuthApiUrl = 
    APP_MODE === "DEV" ? "http://localhost:5001/api" : import.meta.env.VITE_PROD_AUTH;
export const DataApiUrl = 
    APP_MODE === "DEV" ? "http://localhost:5002/api" : import.meta.env.VITE_PROD_DATA;
export const ModerationApiUrl = 
    APP_MODE === "DEV" ? "http://localhost:5003/api" : import.meta.env.VITE_PROD_MODERATION;
export const NotificationApiUrl = 
    APP_MODE === "DEV" ? "http://localhost:5004/api" : import.meta.env.VITE_PROD_NOTIFICATIONS;
export const RegisterApiUrl = 
    APP_MODE === "DEV" ? "http://localhost:5005/api" : import.meta.env.VITE_PROD_REGISTER;
export const SocketApiUrl = 
    APP_MODE === "DEV" ? "http://localhost:5006" : import.meta.env.VITE_PROD_SOCKET;

export const ReturnAuthToken = () => localStorage.getItem("accessToken");
export const ReturnAdminToken = () => localStorage.getItem("accessSAToken");

const createApiInstance = (baseURL: string): AxiosInstance => {
    const instance = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true,
        timeout: 35000
    });

    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = ReturnAuthToken();
            const adminToken = ReturnAdminToken();

            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }

            if (adminToken) {
                config.headers["Admin-Authorization"] = `Bearer ${adminToken}`;
            }
            
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return instance;
};

export const authApi = createApiInstance(AuthApiUrl);
export const dataApi = createApiInstance(DataApiUrl);
export const moderationApi = createApiInstance(ModerationApiUrl);
export const notificationApi = createApiInstance(NotificationApiUrl);
export const registerApi = createApiInstance(RegisterApiUrl);
