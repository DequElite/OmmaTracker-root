import { Link, useNavigate } from "react-router-dom";
import Input from "../../../components/Inputs/Input";
import { useState } from "react";
import { UserType } from "../../../api/types/User/UserTypes";
import { useAppDispatch } from "../../../store/store";
import { setMessageBox } from "../../../store/Slices/messageBox.slice";
import useTitle from "../../../hooks/useTitle";
import { registerApi, RegisterApiUrl } from "../../../api/api";

export default function SignUpPage(){
    useTitle("Omma | Sign up")

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [state, setState] = useState<UserType>({
        username:'',
        email:'',
        password:''
    });

    const handleInputChange = (name:string, value:string) => {
        setState(prevState=>({
            ...prevState,
            [name]:value
        }))
    }

    const SignUpUSer = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const response = await registerApi.post('/signup', {
                username: state.username,
                email: state.email,
                password: state.password
            });
            console.log(response);
            localStorage.setItem("accessToken", response.data.accessToken);
            dispatch(
                setMessageBox({
                    type:'success',
                    description:'Welcome!',
                    isOpened:true,
                    duration: 5000
                })
            )
            navigate('/account');
        } catch (error){
            console.error("Error at sign up: ", error);
            const errorStatus = (error as any).response.status;

            switch (errorStatus) {
                case 409: 
                    dispatch(
                        setMessageBox({
                            type:'error',
                            description:'Such a user already exists in the system!',
                            isOpened:true,
                            duration: 5000
                        })
                    )
            }
        }
    }

    const GoogleSignUpUser = () => {
        window.location.href = `${RegisterApiUrl}/google`
    }

    return (
        <>
            <div className="container container--middle container--register_signup">
                <div className="container__left">
                    <div className="container__left-images">
                        <div className="container__left-images--first"></div>
                        <div className="container__left-images--second"></div>
                        <div className="container__left-images--third"></div>
                    </div>
                    <div className="container__left-content">
                        <div className="content__header">
                            <h1 className="content__header-text">
                                Welcome!
                            </h1>
                            <p className="content__header-desc">
                                Here you can plan, track, and mark your tasks and achievements!
                            </p>
                        </div>
                        <div className="content__footer">
                            <p> If you have an account, then <Link to="/register/signin">sign in</Link> </p>
                        </div>
                    </div>
                </div>
                <div className="container__right">
                    <form className="container__right-form" onSubmit={SignUpUSer}>
                        <h1 className="form__header">
                            Create Account
                        </h1>
                        <div className="form__content">
                            <div className="form__content-inputs">
                                <Input 
                                    model={state.username} 
                                    setChange={handleInputChange} 
                                    placeholder="username"
                                    name="username"
                                />             
                                <br />
                                <Input 
                                    model={state.email} 
                                    setChange={handleInputChange} 
                                    placeholder="email"
                                    type="email"
                                    name="email"
                                /> 
                                <br />
                                <Input 
                                    model={state.password || ''} 
                                    setChange={handleInputChange} 
                                    placeholder="password"
                                    type="password"
                                    name="password"
                                /> 
                            </div>

                            <br />

                            <div className="form__content-buttons">
                                <button className="submit-button" type="submit"  disabled={state.username === "" || state.password === "" || state.email === ""}>
                                    Create Account
                                </button>
                                <div className="form__content-buttons-or">
                                    <div className="or__line"></div>
                                    <span className="or__text">
                                        OR
                                    </span>
                                </div>
                                <button type="button" className="google-button" onClick={GoogleSignUpUser}>
                                    <img src="/light/google.svg" alt="" />
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}