import { useState } from "react";
import Input from "../../../components/Inputs/Input";
import "./style.scss";
import { useAppDispatch } from "../../../store/store";
import { setMessageBox } from "../../../store/Slices/messageBox.slice";
import useTitle from "../../../hooks/useTitle";
import { registerApi } from "../../../api/api";

export default function ForgotPassword(){
    useTitle("Omma | Forgot password")

    const [email, setEmail] = useState("");

    const dispatch = useAppDispatch();

    const sendKey = async () => {
        try{
            const response = await registerApi.post('/forgot-password/send-key', { email: email });
            console.log(response);
            if(response.status === 200){
                dispatch(
                    setMessageBox({
                        type:'success',
                        description:'We sent you a letter by mail, check it out!',
                        isOpened:true,
                        duration: 5000
                    })
                )
            }
        } catch (error) {
            console.error("Error at forgot-password: ", error);
        }
    }

    return (
        <>
            <div className="forgot_password container--middle">
                <div className="forgot_password__header">
                    <h1 className="forgot_password__header-text">
                        Forgot password?
                    </h1>
                    <p className="forgot_password__header-desc">
                        Don`t worry! We will send you an email to your mail, just indicate it at the bottom!
                    </p>
                </div>
                <div className="forgot_password__content">
                    <Input
                        model={email}
                        setChange={(_:string, value:string)=>{setEmail(value)}}
                        type="email"
                        name="email"
                        placeholder="Email"
                    />
                    <button onClick={sendKey} className="forgot_password__content-btn" disabled={email === ""}>
                        Send Key
                    </button>
                </div>
            </div>
        </>
    )
}