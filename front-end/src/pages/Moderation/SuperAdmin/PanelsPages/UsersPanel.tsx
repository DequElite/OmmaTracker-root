import { useEffect, useState } from "react"
import { UserType } from "../../../../api/types/User/UserTypes"
import { moderationApi } from "../../../../api/api";

export default function UsersPanel() {

    const [users, setUsers] = useState<UserType[]>([]);

    useEffect(()=>{
        const fetchUsers = async () => {
            try{
                const response = await moderationApi.get('/get-all-users');
                setUsers(response.data.users);
                console.log("resp: ", response);
            } catch (error){
                console.error("Error at fetch users in users panel: ", error);
            }
        }

        fetchUsers();
    },[])

    const handleDeleteUser = async (index:number) => {
        try{
            const response = await moderationApi.delete('/delete-user', {
                data: { id: users[index].id }
            });
            setUsers(response.data.users);
            console.log("resp: ", response);
        } catch (error){
            console.error("Error at delete in users panel: ", error);
        }
    }

    return (
        <>
            <div className="userpanel">
                <header className="userpanel__header">
                    <h1>
                        All users
                    </h1>
                </header>
                <main className="userpanel__main">
                    <ul className="userpanel__main-list">
                        {
                            users && users.map((el:UserType, index)=>(
                                <li className="userpanel__main-item" key={index}>
                                    <div className="item__user">
                                        <img src="/light/users.png" alt="" className="item__user-img"/>
                                        <div className="item__user-info">
                                            <h1>{el.username} | ID {el.id}</h1>
                                            <h2 className="blue">
                                                {el.email}
                                            </h2>
                                        </div>
                                    </div>
                                    <button className="item__delete" onClick={()=>handleDeleteUser(index)}>Delete</button>
                                </li>
                            ))
                        }
                    </ul>
                </main>
            </div>
        </>
    )
}