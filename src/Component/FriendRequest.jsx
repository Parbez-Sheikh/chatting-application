import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useEffect } from "react";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";


const FriendRequest = () => {

  const db=getDatabase();
  const data=useSelector((state)=>state.userLoginInfo.userInfo)

  const[friendRequestList,setFriendRequestList]=useState([])

//   console.log(friendRequestList)
// friend request list from friend request collection
  useEffect(()=>{
    const friendRequestRef=ref(db,'friendRequest')
    
    onValue(friendRequestRef,(snapshot)=>{
        let list=[];
        snapshot.forEach((item)=>{
            if(item.val().receverId === data.uid){
                list.push({...item.val(), id: item.key})
            }
      
        })
        setFriendRequestList(list)
    })

  },[])

// friend request list from friend request collection

// friend request accept start
const handleFriendRequestAccept=(item)=>{
   set(push(ref(db,'friend')),{
   ...item
   }).then(()=>{
    remove(ref(db,'friendRequest/'+item.id))
   })
}

// friend request accept end
// friend request cencle
const handleFriendRequestcencle=(item)=>{
   
     remove(ref(db,'friendRequest/'+item.id))

 }
// friend request cencle

    return (
      <div className="mb-3">

            <div className="title">
                <h2>Friend Request</h2>
                <BsThreeDotsVertical className="text-2xl" />
            </div>

                <div>
                    {
                        friendRequestList.map((item)=>{
                            return(
                                <div key={item.id} className="flex justify-between items-center mb-3 pb-3 border-b border-secondery">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-[60px] h-[60px] bg-orange-400 rounded-full overflow-hidden">
                                        {/* <img className="w-full" src="" alt="" /> */}
                                        <ProfilePicture imgId={item.senderId}></ProfilePicture>
                                        </div>
                                        <div>
                                        <h2 className="font-bold text-xl text-whi">{item.senderName}</h2>
                                    
                                        </div>
                                    </div>
                            
                                    <div className="flex gap-1">
                                        <button onClick={()=>handleFriendRequestAccept(item)} className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Accept</button>
                                        <button onClick={()=>handleFriendRequestcencle(item)} className="bg-red-500 px-2 py-1 rounded-xl text-white">cancel</button>
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>
     
   
     
        </div>
    );
};

export default FriendRequest;