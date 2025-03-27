import { Link } from "react-router-dom"
import "./Header.style.scss";

export default function Header({ newNotification }: { newNotification: boolean }) {
  return (
    <>
      <header className="bg-[#1E1E1E] w-full h-17 flex justify-between overflow-hidden">
        <Link to="/home">
          <img src="/favicons/Omma.svg" alt="Omma"  className="w-17"/>
        </Link>
        <div className="w-[10%] h-full flex justify-end items-center gap-1 max-sm:w-[50%]">
          <Link to='/dashboard/tasks'>
            <img src="/graph.png" alt="" className="w-[60%]" />
          </Link>
          <Link
            to="?is_notfs=open"
          >
             <img
              src={newNotification ? "/light/red-bell.png" : "/bell.png"}
              alt=""
              className={`w-[60%] ${newNotification ? 'animate-shake' : ''}`} // Add shake animation when there's a new notification
            />
          </Link>
          <Link to="/dashboard/account">
            <img src="/DefUserIcon.png" alt="" className="w-12"/>
          </Link>
        </div>
      </header>
    </>
  );
}
