
import { getDatabase, onValue,push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";
import { activeChat } from "../features/counter/activeChatSlice";


const Friends = () => {
    const db=getDatabase();
    const data=useSelector((state)=>state.userLoginInfo.userInfo)
    const[friendList,setFriendList]=useState([])
    const dispatch=useDispatch();
// console.log(friendList)

// friend list from friends collection start
useEffect(()=>{
    const friendRef=ref(db,'friend');
    onValue(friendRef,(snapshot)=>{
        const list=[];
        snapshot.forEach((item)=>{
           if(data.uid==item.val().receverId || data.uid==item.val().senderId){
            list.push({...item.val(), id:item.key})
           }

        })
        
         setFriendList(list)

    })
    
},[])

// friend list from friends collection start

// block start
const handleBlock=(item)=>{
    if(data.uid==item.senderId){
        set(push(ref(db,'block')), {
        block:item.receverName,
        blockId:item.receverId,
        blockBy:item.senderName,
        blockById:item.senderId
       }).then(()=>{
        remove(ref(db,'friend/'+item.id))
       })
   }
    else{
        set(push(ref(db,'block')), {
            block:item.senderName,
            blockId:item.senderId,
            blockBy:item.receverName,
            blockById:item.receverId,
        }).then(()=>{
            remove(ref(db,'friend/'+item.id))
           })
    }
}
// block end

// unfriend start
const handleUnfriend=(item)=>{
    remove(ref(db,'friend/'+item.id))
}
// unfriend start

// active friend start
const handleActiveFriend=(item)=>{
 if(item.receverId==data.uid){
    dispatch(activeChat({status:'single', id:item.senderId, name:item.senderName}))
    localStorage.setItem('activeFriend', JSON.stringify({status:'single', id:item.senderId, name:item.senderName}))
 }
 else{
    dispatch(activeChat({status:'single', id:item.receverId, name:item.receverName}))
    localStorage.setItem('activeFriend', JSON.stringify({status:'single', id:item.receverId, name:item.receverName}))
 }



}
// active friend start


    return (
        <div className="mb-3">

        <div className="title">
           <h2>Friends</h2>
           <BsThreeDotsVertical className="text-2xl" />
       </div>

       <div>
           {
            friendList.map((item)=>{
                return(
                    <div onClick={()=>handleActiveFriend(item)} key={item.id} className="flex cursor-pointer justify-between items-center mb-3 pb-3 border-b border-secondery">
                    <div className="flex gap-4 items-center">
                   <div className="w-[60px] h-[60px] bg-orange-400 rounded-full overflow-hidden">
                       {/* <img className="w-full" src="" alt="" /> */}
                       <ProfilePicture imgId={data.uid==item.senderId ? item.receverId :item.senderId}></ProfilePicture>
                   </div>
                   <div>
                    {
                        data.uid==item.senderId ?
                       <h2 className="font-bold text-xl text-whi">{item.receverName}</h2> 
                        :
                        <h2 className="font-bold text-xl text-whi">{item.senderName}</h2>

                    }
                       
                       <p>hi....</p>
                   </div>
                    </div>
               
               <div className="flex gap-1">
                   <button onClick={()=>handleUnfriend(item)} className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Unfriend</button>
                   <button onClick={()=>handleBlock(item)} className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Block</button>
               </div>

           </div>
                )
            })
           }
       </div>
     
      
       
      
      
       
   </div>
    );
};

export default Friends;