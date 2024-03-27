import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";



const MyGroup = () => {

    const db=getDatabase();
    const data=useSelector((state)=>state.userLoginInfo.userInfo)
    const[groupList,setGroupList]=useState([])
    const[showRequest,setShowRequest]=useState(false);
    const[groupJoinRequestList,setGroupJoinRequestList]=useState([])
    const[showGroupInfo,setShowGroupInfo]=useState(false)
    const[groupMembers,setGroupMembers]=useState([])


    console.log(groupJoinRequestList)
    //get my Group start
    const groupRef= ref(db,'group')
    useEffect(()=>{
        onValue(groupRef,(snapshot)=>{
            let list=[];
            snapshot.forEach((item)=>{
                if(data.uid == item.val().adminId){
                    list.push({...item.val(), key:item.key})
                }

            })
            setGroupList(list)
        })
    },[])

      //get my Group end
    //   group Delete start
    const handleDeleteGroup=(item)=>{
      remove(ref(db,'group/'+item.key))
    }
    //   group Delete end


     //   group Request start
     const handleGroupRequest=(group)=>{
        setShowRequest(!showRequest)

        const groupRequestRef=ref(db,'groupJoinRequest')
        onValue(groupRequestRef,(snapshot)=>{
            let list=[];
            snapshot.forEach((item)=>{
                if(data.uid==item.val().adminId && item.val().groupId==group.key){
                    list.push({...item.val(), key:item.key})

                }
            })

            setGroupJoinRequestList(list)

        })

      }
      //   group Request end

    //   group request accept start
    const handleGroupRequestAccept=(item)=>{
        set(push(ref(db,'groupMembers')),{
            groupId:item.groupId,
            groupName:item.groupName,
            adminId:item.adminId,
            adminName:item.adminName,
            userId:item.userId,
            userName:item.userName,
        }).then(()=>{
            remove(ref(db,'groupJoinRequest/'+item.key))
        })

    }
     //   group request accept end

    //  group request reject start

    const handleGroupRequestReject=(item)=>{
        remove(ref(db,'groupJoinRequest/'+item.key))
    }

    //  group request reject end

      //  group info start

      const handleGroupInfo=(itemInfo)=>{
        setShowGroupInfo(!showGroupInfo)

        const groupMembersRef=ref(db,'groupMembers');
        onValue(groupMembersRef,(snapshot)=>{
            let list=[];
            snapshot.forEach((item)=>{

                if(data.uid==itemInfo.adminId && item.val().groupId==itemInfo.key){
                    list.push({...item.val(),key:item.key})

                }

            })
            setGroupMembers(list)
        })
    }

    //  group info end





    return (
      <div className="mb-3">

             <div className="title">
                <h2>My Group</h2>
                <BsThreeDotsVertical className="text-2xl" />
            </div>

            <div>
                {
                    groupList.length == 0 ?
                    <h2 className="text-red-600 text-center font-bold text-2xl">No Group Available</h2>
                    :
                    showRequest?
                    <div className="bg-red-400 relative p-10 rounded-lg">
                         <button onClick={()=>setShowRequest(!showRequest)} className="bg-emerald-500 absolute right-1 top-1 block px-2 py-1 rounded-xl text-white">close</button>

                         {
                           groupJoinRequestList.map((item,i)=>{
                            return(
                                <div key={i} className="flex justify-between items-center mb-3 pb-3   border-b border-secondery">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-[60px] h-[60px] bg-orange-400 rounded-full overflow-hidden flex justify-center items-center">
                                            {/* <img className="w-full" src="" alt="" /> */}
                                        <ProfilePicture imgId={item.userId}></ProfilePicture>
                                        </div>
                                        <div>
                                            <h2 className="text-red-600">{item.userName}</h2>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                    
                                        <button onClick={()=>handleGroupRequestAccept(item)} className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Accept</button>
                                        <button onClick={()=>handleGroupRequestReject(item)} className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Reject </button>
                                    </div>

                                </div> 


                            )
                           }) 
                         }
                    </div>
                    :
                    showGroupInfo?
                    <div className="bg-red-400 relative p-10 rounded-lg">
                    <button onClick={()=>setShowGroupInfo(!showGroupInfo)} className="bg-emerald-500 absolute right-1 top-1 block px-2 py-1 rounded-xl text-white">close</button>

                    {
                      groupMembers.map((item,i)=>{
                       return(
                           <div key={i} className="flex justify-between items-center mb-3 pb-3   border-b border-secondery">
                               <div className="flex gap-4 items-center">
                                   <div className="w-[60px] h-[60px] bg-orange-400 rounded-full overflow-hidden flex justify-center items-center">
                                       {/* <img className="w-full" src="" alt="" /> */}
                                   <ProfilePicture imgId={item.userId}></ProfilePicture>
                                   </div>
                                   <div>
                                       <h2 className="text-red-600">{item.userName}</h2>
                                   </div>
                               </div>
                               
                               <div className="flex gap-2">
                               
                                   <button onClick={()=>handleGroupRequestAccept(item)} className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Accept</button>
                                   <button onClick={()=>handleGroupRequestReject(item)} className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Reject </button>
                               </div>

                           </div> 


                       )
                      }) 
                    }
               </div>
                    :
                    groupList.map((item,i)=>{
                        return(
                            <div key={i} className="flex justify-between items-center mb-3 pb-3   border-b border-secondery">
                               <div className="flex gap-4 items-center">
                                <div className="w-[60px] h-[60px] bg-orange-400 rounded-full overflow-hidden flex justify-center items-center">
                                    {/* <img className="w-full" src="" alt="" /> */}
                                    <h2 className="font-bold text-orange-800 uppercase text-2xl">{item.groupName[0]}</h2>
                                </div>
                                <div>
                                    <h2 className="text-red-600">Admin: {item.adminName}</h2>
                                    <h2 className="font-bold text-xl text-whi">{item.groupName}</h2>
                                    <p>{item.groupIntro}</p>
                                </div>
                               </div>
                            
                               <div className="flex gap-2">
                                <button onClick={()=>handleGroupInfo(item)} className="bg-emerald-500 px-2 py-1 rounded-xl text-white">info</button>
                                <button onClick={()=>handleGroupRequest(item)} className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Request</button>
                                <button onClick={()=>handleDeleteGroup(item)} className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Delete</button>
                               </div>

                        </div> 

                        )
                    })

                }

               
               
            </div>
           
           
           
           
            
            
        </div>
    );
};

export default MyGroup;