import { useNavigate } from "react-router-dom";
import Input from "../../../../components/Inputs/Input";
import useTitle from "../../../../hooks/useTitle";
import { useAppDispatch } from "../../../../store/store";
import { useState } from "react";
import api from "../../../../api/api";
import { setMessageBox } from "../../../../store/Slices/messageBox.slice";

export default function SignInAdmin(){
    useTitle("Ommad | Admin Sign in")
    
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [state, setState] = useState({
        adminname:'',
        password:''
    });

    const handleInputChange = (name:string, value:string) => {
        setState(prevState=>({
            ...prevState,
            [name]:value
        }))
    }

    const SignInAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const response = await api.post('/moderation/admin/signin', {
                adminname: state.adminname,
                password: state.password
            });
            console.log(response);
            dispatch(
                setMessageBox({
                    type:'success',
                    description:'Welcome!',
                    isOpened:true,
                    duration: 5000
                })
            )
            navigate('/moderation/super_admin/lair');
        } catch (error){
            console.error("Error at sign in: ", error);
            const errorStatus = (error as any).response.status;

            switch (errorStatus) {
                case 404: 
                    dispatch(
                        setMessageBox({
                            type:'error',
                            description:'Are you sure you`re the admin?',
                            isOpened:true,
                            duration: 5000
                        })
                    )
                    return;
                case 422:
                    dispatch(
                        setMessageBox({
                            type:'error',
                            description:'If the password is not correct, then you should leave here :)',
                            isOpened:true,
                            duration: 5000
                        })
                    )
                    return;
            }
        }
    }

    return (
        <>
            <div className="container container--middle container--register_signup">
                <div className="container__right">
                    <form className="container__right-form" onSubmit={SignInAdmin}>
                        <h1 className="form__header">
                            Admin SignIn
                        </h1>
                        <div className="form__content">
                            <div className="form__content-inputs">
                                <Input 
                                    model={state.adminname}
                                    setChange={handleInputChange} 
                                    placeholder="adminname"
                                    type="text"
                                    name="adminname"
                                /> 
                                <br />
                                <Input 
                                    model={state.password} 
                                    setChange={handleInputChange}
                                    placeholder="password"
                                    type="password"
                                    name="password"
                                /> 
                            </div>

                            <br />

                            <div className="form__content-buttons">
                                <button className="submit-button" type="submit">
                                    Sign admin
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
                <div className="container__left">
                    <div className="container__left-images">
                        <div className="container__left-images--first"></div>
                        <div className="container__left-images--second"></div>
                        <div className="container__left-images--third"></div>
                    </div>
                    <div className="container__left-content">
                        <div className="content__header">
                            <h1 className="content__header-text">
                                Moderation lair
                            </h1>
                            <p className="content__header-desc">
                                Enter admin account details
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}