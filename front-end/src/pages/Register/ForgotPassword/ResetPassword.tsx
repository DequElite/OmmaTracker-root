import { useState } from "react";
import Input from "../../../components/Inputs/Input";
import "./style.scss";
import useQuery from "../../../hooks/useQuery";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/store";
import { setMessageBox } from "../../../store/Slices/messageBox.slice";
import useTitle from "../../../hooks/useTitle";
import { registerApi } from "../../../api/api";

export default function ResetPassword(){
    useTitle("Omma | Reset password")

    const [password, setPassword] = useState("");

    const locationQuery = useQuery()
    const navigate = useNavigate()
    const dispatch = useAppDispatch();

    const resetPassword = async () => {
        try {
            const response = await registerApi.post('/reset-password', { resetToken: locationQuery.get("key"), newUserPassword: password })
            console.log(response);
            if(response.status === 200){
                navigate('/register/signin');
                dispatch(
                    setMessageBox({
                        type:'success',
                        description:'Welcome! You have successfully changed your account password!',
                        isOpened:true,
                        duration: 3000
                    })
                )
            }
        } catch (error) {
            console.error("Error at resetPassword: ", error);
        }
    }

    return (
        <>
            <div className="forgot_password container--middle">
                <div className="forgot_password__header">
                    <h1 className="forgot_password__header-text">
                        New password
                    </h1>
                    <p className="forgot_password__header-desc">
                        So, you can now change your old password to a new one!
                    </p>
                </div>
                <div className="forgot_password__content">
                    <Input
                        model="" 
                        setChange={(_:string, value:string)=>{setPassword(value)}}
                        type="password"
                        name="password"
                        placeholder="New password"
                    />
                    <button className="forgot_password__content-btn" disabled={password === ""} onClick={resetPassword}>
                        Change password
                    </button>
                </div>
            </div>
        </>
    )
}