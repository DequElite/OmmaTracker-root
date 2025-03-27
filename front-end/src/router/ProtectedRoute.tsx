import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../components/Loading/Loading";
import { moderationApi } from "../api/api";

interface ProtectedRouteProps {
    Element: ReactElement;
}

export default function ProtectedRoute({ Element }: ProtectedRouteProps) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthAdmin, setIsAuthAdmin] = useState<boolean>(false);

    useEffect(()=>{
        
        const checkSAdminAuth = async () => {
            try{
                const response = await moderationApi.get('/super_admin/profile', {
                    withCredentials: true
                });
                console.log("response checkSAdminAuth: ", response);
                if(response.status === 200 && response.data.sa && response.data.isAdmin){
                    setIsAuthAdmin(true);
                } else {
                    navigate("/home");
                }

            } catch (error) {
                console.error("error at checkSAdminAuth: ", error);
                navigate("/home");
            } finally {
                setIsLoading(false);
            }
        }

        checkSAdminAuth();

    }, [navigate]);

    if(isLoading){
        return <LoadingComponent loadingText="Load data..." type='loading' />
    }

    return isAuthAdmin ? Element : null;
}