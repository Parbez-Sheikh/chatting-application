import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import ProfilePicture from "./ProfilePicture";


const UserList = () => {
    const db = getDatabase();
    const data = useSelector((state) =>state.userLoginInfo.userInfo)
    let[userList,setUserList]=useState([]);
    let[friendRequestList,setFriendRequestList]=useState([])
    let[friendList,setFriendList]=useState([])
    let[searchUser,setSearchUser]=useState([])
   
    // console.log(friendRequestList)
    useEffect(()=>{
        const userRef= ref( db ,'users');
        onValue(userRef, (snapshot) => {

            let list=[];
            snapshot.forEach((item) => {
                if(data.uid !== item.key){
                    list.push({...item.val(), id:item.key})
                }      
            });
            setUserList(list)
          });

    },[])

    // get user list from users collection end

// friend request send start
const handleFriendRequestSend=(item)=>{

    set(push(ref(db, 'friendRequest')),{
        senderId:data.uid,
        senderName:data.displayName,
        receverId:item.id,
        receverName:item.username,
        
      });
}

useEffect(()=>{
    const friendRequestRef= ref( db ,'friendRequest');
        onValue(friendRequestRef, (snapshot) => {

            let request=[];
            snapshot.forEach((item) => {
              request.push(item.val().receverId + item.val().senderId)
                  
            });
            setFriendRequestList(request)
          });

},[])


// friend request send end

// friend list data from friend collectin start
useEffect(()=>{

    const friendListRef= ref (db,'friend');
    onValue(friendListRef, (snapshot)=>{
        let list=[]
        snapshot.forEach((item)=>{
          list.push(item.val().receverId + item.val().senderId)

        })
        setFriendList(list)
    })


},[])

// friend list data from friend collectin end

// search start
const handleSearch=(e)=>{
let arr=[];

userList.filter((item)=>{
if(item.username.toLowerCase().includes(e.target.value.toLowerCase())){
   
   arr.push(item)
}
})
setSearchUser(arr)
}
console.log(searchUser)
// search end

    return (
        <div className="mb-3">

             <div className="title">
                <h2>User List</h2>
                <input onChange={handleSearch} type="text" placeholder="search" className=" input text-black outline-none border-2 rounded-lg border-red-600 w-[200px]" />
                <BsThreeDotsVertical className="text-2xl" />
            </div>
            {
                searchUser.length>0?
                searchUser.map((item,i)=>{
                    // console.log(item)
                    return(
                        <div key={i}>
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-secondery">
                            <div className="flex gap-4 items-center">
                                <div className="w-[60px] h-[60px] bg-orange-400 rounded-full overflow-hidden">
                                    {/* <img className="w-full" src="" alt="" /> */}
                                    <ProfilePicture imgId={item.id}></ProfilePicture>
                                </div>
                                <div>
                                    <h2 className="font-bold text-xl text-whi">{item.username}</h2>
                                    <p>{item.email}</p>
                                </div>
                            </div>
                            
                            <div>
                                {
                                    friendList.includes(item.id+data.uid)|| friendList.includes(data.uid+item.id)?
                                    <button className="bg-emerald-500 px-2 py-1 rounded-xl text-white">friend</button>
        
                                    :
                                    friendRequestList.includes(item.id + data.uid ) ||  friendRequestList.includes(data.uid + item.id )
                                    ?
                                    <button className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Panding...</button>
                                    : 
                                    <button onClick={()=>handleFriendRequestSend(item)} className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Add Friend</button>
                                }
                                
                                
                            </div>
        
                        </div>
                    </div>
                  )
                })
                :
                userList.map((item,i)=>{
                    // console.log(item)
                    return(
                        <div key={i}>
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-secondery">
                            <div className="flex gap-4 items-center">
                                <div className="w-[60px] h-[60px] bg-orange-400 rounded-full overflow-hidden">
                                    {/* <img className="w-full" src="" alt="" /> */}
                                    <ProfilePicture imgId={item.id}></ProfilePicture>
                                </div>
                                <div>
                                    <h2 className="font-bold text-xl text-whi">{item.username}</h2>
                                    <p>{item.email}</p>
                                </div>
                            </div>
                            
                            <div>
                                {
                                    friendList.includes(item.id+data.uid)|| friendList.includes(data.uid+item.id)?
                                    <button className="bg-emerald-500 px-2 py-1 rounded-xl text-white">friend</button>
        
                                    :
                                    friendRequestList.includes(item.id + data.uid ) ||  friendRequestList.includes(data.uid + item.id )
                                    ?
                                    <button className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Panding...</button>
                                    : 
                                    <button onClick={()=>handleFriendRequestSend(item)} className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Add Friend</button>
                                }
                                
                                
                            </div>
        
                        </div>
                    </div>
                  )
                })

            }

          
       
            
        </div>
    );
};

export default UserList;