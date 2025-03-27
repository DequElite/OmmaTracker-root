import { useEffect, useState } from "react";
import Input from "../../components/Inputs/Input";
import "./style.scss";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setMessageBox } from "../../store/Slices/messageBox.slice";
import useTitle from "../../hooks/useTitle";
import { authApi } from "../../api/api";

interface AccountPageDataState {
    username: string;
    oldPassword?:string | null,
    newPassword?:string | null,
}

export default function AccountPage(){
    useTitle("Omma | Account")

    const dispatch = useAppDispatch();
    const userProfileState = useAppSelector((state)=>state.userProfile);

    const [state, setState] = useState<AccountPageDataState>({
        username:'',
        oldPassword:null,
        newPassword:null
    })

    const handleInputChange = (name:string, value:string) => {
        setState(prevState => ({
            ...prevState,
            [name]:value
        }))
    }

    useEffect(()=>{
        handleInputChange('username', userProfileState.username);
    },[userProfileState.username])

    const ChangeUserData = async () => {
        try{
            const response = await authApi.post('/profile/change', {
                NewUsername: state.username,
                OldPassword: state.oldPassword,
                NewPassword: state.newPassword
            });
            console.log(response);
            if(response.status === 200){
                const newAccessToken = response.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);

                dispatch(
                    setMessageBox({
                        type:'success',
                        description:'Data was changed successfully!',
                        isOpened:true,
                        duration: 5000
                    })
                )
            }
        } catch (error){
            console.error("Error at sign in: ", error);
            const errorStatus = (error as any).response.status;
        
            switch (errorStatus) {
                case 422:
                    dispatch(
                        setMessageBox({
                            type:'error',
                            description:'Password is incorrect',
                            isOpened:true,
                            duration: 5000
                        })
                    )
            }
        }
    }

    return (
        <>
            <div className="container--middle account">
                <header className="account__header">
                    <img src="/DefUserIcon.png" alt="" className="account__header-img"/>
                    <h1 className="account__header-text">
                        {userProfileState.username}
                    </h1>
                </header>
                <main className="account__content">
                    <h1 className="account__content-header">
                        Change profile data
                    </h1>
                    <div className="account__content-field">
                        <Input 
                            model={state.username}
                            name="username"
                            type="text"
                            placeholder="username"
                            setChange={handleInputChange}
                        />
                        <Input 
                            model={state.oldPassword || ''}
                            name="oldPassword"
                            type="password"
                            placeholder="Old password"
                            setChange={handleInputChange}
                        />
                        <Input 
                            model={state.newPassword || ''}
                            name="newPassword"
                            type="password"
                            placeholder="New password"
                            setChange={handleInputChange}
                        />
                        <button onClick={ChangeUserData}>
                            Change Data
                        </button>
                    </div>
                </main>
            </div>
        </>
    )
}