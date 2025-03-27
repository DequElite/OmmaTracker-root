import { useNavigate } from "react-router-dom";
import "./style.scss";
import { useAppSelector } from "../../store/store";
import useQuery from "../../hooks/useQuery";
import { useEffect } from "react";
import useTitle from "../../hooks/useTitle";

export default function HomePage(){
    useTitle("Omma | Home");

    const navigate = useNavigate();
    const locationQuery = useQuery();

    const userProfileAuthState = useAppSelector(state=>state.userProfile.isAuth);
    
    useEffect(()=>{
        if(locationQuery.get("accessToken")){
            localStorage.setItem("accessToken", locationQuery.get("accessToken") as string);
            navigate('/')
        }
    },[])

    return (
        <>
            <div className="container container--middle">
                <header className="container--middle__header">
                    <img src="/favicon.svg" alt="" />
                    <h1>
                        Omma Tracker
                    </h1>
                </header>
                <main className="container--middle__content">
                    <div className="content__images">
                        <div className="content__images--first"></div>
                        <div className="content__images--second"></div>
                        <div className="content__images--third"></div>
                        <div className="content__images--fourth"></div>
                    </div>
                    <div className="content__main">
                        <p className="content__main-text">
                            With Omma Tracker you can track your progress in completing tasks, and your productivity!
                        </p>
                        {
                            !userProfileAuthState 
                            ? (
                                <button className="content__main-button" onClick={()=>navigate('/register/signup')}>
                                    Get Started!
                                </button>
                            )
                            : (
                                <button className="content__main-button" onClick={()=>navigate('/dashboard')}>
                                    Get Started!
                                </button>
                            )
                        }
                    </div>
                </main>
            </div>
        </>
    )
}