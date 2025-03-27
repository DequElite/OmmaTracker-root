import { Outlet } from "react-router-dom";
import "./style.scss";
import useFavicon from "../../hooks/useFavicon";
import useTitle from "../../hooks/useTitle";

export default function ModerationPage(){
    useFavicon('/favicons/Ommad.svg');
    useTitle("Ommad | Omma moderation")


    return (
        <>  
            <Outlet />
        </>
    )
}