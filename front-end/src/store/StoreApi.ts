import { createApi, fetchBaseQuery, FetchArgs } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { authApi, AuthApiUrl, ModerationApiUrl, ReturnAdminToken, ReturnAuthToken } from "../api/api";

const createBaseQuery = (baseUrl: string) =>
    fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
            const token = ReturnAuthToken();
            const adminToken = ReturnAdminToken();

            if (token) headers.set("Authorization", `Bearer ${token}`);
            if (adminToken) headers.set("admin-authorization", `Bearer ${adminToken}`);
            headers.set("Content-Type", "application/json");

            return headers;
        },
        credentials: "include",
    });
const baseQueryWithReauth = (baseUrl: string) => async (args: string | FetchArgs, api: any, extraOptions: any) => {
    let result = await createBaseQuery(baseUrl)(args, api, extraOptions);
   
    if (result.error && result.error.status === 403) {
        console.error("403 Detected, attempting token refresh...");
    
        try {
            const response = await axios.get(`${baseUrl}/refresh`, { withCredentials: true });

            if (response.status === 200) {
                const newAccessToken = response.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                if (typeof args === "string") args = { url: args };
                args.headers = { ...args.headers, Authorization: `Bearer ${newAccessToken}` };
    
                console.log("Retrying request with new token...");
                result = await createBaseQuery(baseUrl)(args, api, extraOptions);
            }
        } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            return result;
        }
    }

    return result;
};

export const BaseStoreApi = createApi({
    reducerPath: "BaseStoreApi",
    baseQuery: baseQueryWithReauth(AuthApiUrl),
    endpoints: (create) => ({
        fetchProfileUser: create.query<any, void>({
            query: () => ({
                url: "/profile", 
            }),
        }),
        fetchAdmin: create.query<any, void>({
            query: () => ({
                url: "/super_admin/profile", 
                baseUrl: ModerationApiUrl, 
            }),
        }),
    }),
});
    
// const baseQuery = fetchBaseQuery({
//     baseUrl:BaseApiUrl,
//     prepareHeaders: (headers) => {
//         const token = ReturnAuthToken();
//         const adminToken = ReturnAdminToken();

//         if(token){
//             headers.set("Authorization", `Bearer ${token}`);
//         }

//         if (adminToken) {
//             headers.set("admin-authorization", `Bearer ${adminToken}`);
//         }

//         headers.set("Content-Type", "application/json");
//         return headers;
//     },
//     credentials:'include'
// });

// const baseQueryWithReauth = async (args: string | FetchArgs, api: any, extraOptions: any) => {
//     let result = await baseQuery(args, api, extraOptions);

//     if(result.error && result.error.status === 403){
//         console.error("403 Detected");

//         try{
//             const response = await axios.get(`${BaseApiUrl}/auth/refresh`, {
//                 withCredentials: true, 
//             });

//             if(response.status === 200){
//                 const newAccessToken = response.data.accessToken;
//                 localStorage.setItem("accessToken", newAccessToken);

//                 if (typeof args === "string") {
//                     args = { url: args };
//                 }
//                 args.headers = {
//                     ...args.headers,
//                     Authorization: `Bearer ${newAccessToken}`,
//                 };

//                 console.log("Retrying request with new token...");
//                 result = await baseQuery(args, api, extraOptions);
//             }
//         } catch (refreshError) {
//             console.error("Failed to refresh token:", refreshError);
//             return result; 
//         }
//     }

//     return result;
// }

// export const BaseStoreApi = createApi({
//     baseQuery: baseQueryWithReauth,
//     endpoints: (create) => ({
//         fetchProfileUser: create.query<any, void>({
//             query: () => ({
//                 url: "/auth/profile",
//             }),
//         }),
//         fetchAdmin: create.query<any, void>({
//             query: () => ({
//                 url: "/moderation/super_admin/profile",
//             }),
//         }),
//     })
// })