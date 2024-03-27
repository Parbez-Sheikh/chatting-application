import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';


const GroupList = () => {

    const db=getDatabase();
    const data=useSelector((state)=>state.userLoginInfo.userInfo)

    const [show,setShow]=useState(false)
    // input start
    const [groupName,setGroupName]=useState('')
    const [groupIntro,setGroupIntro]=useState('')
     // input end

    //  Error start
    const [groupNameError,setGroupNameError]=useState('')
    const [groupIntroError,setGroupIntroError]=useState('')
     //  Error end

     const[groupList,setGroupList]=useState([]);
    //  console.log(groupList)

     const handleGroupName=(e)=>{
        setGroupName(e.target.value)
        setGroupNameError('')

     }

     const handleGroupIntro=(e)=>{
        setGroupIntro(e.target.value)
        setGroupIntroError('')
     }

    //  create group start
const handleCreateGroup=()=>{
    if(groupName==''){
        setGroupNameError("Group name is require")
    }
    else if(groupIntro==''){
        setGroupIntroError("Group intro is require")
    }
    else{
      
       set(push(ref(db,'group')),{
        groupName: groupName,
        groupIntro:groupIntro,
        adminName: data.displayName,
        adminId: data.uid,
       }).then(()=>{
        toast.success("Group Created")
        setShow(false)
        setGroupName("")
        setGroupIntro('')
       
       })
    }
}

     //  create group end

    //  group list start

    useEffect(()=>{

        const groupRef=ref(db,'group')
        onValue(groupRef, (snapshot) => {
            let list=[];
            snapshot.forEach((item)=>{
                if(data.uid != item.val().adminId){
                    list.push({...item.val(), id:item.key})
                }

            })

            setGroupList(list)
        })


    },[])

    //  group list end

    // handle join group start

const handleJoinGroup=(item)=>{

   set(push(ref(db,'groupJoinRequest')),{
    groupId:item.id,
    groupName:item.groupName,
    groupIntro:item.groupIntro,
    adminId:item.adminId,
    adminName:item.adminName,
    userId:data.uid,
    userName:data.displayName,
   }).then(()=>{
    toast.success("request sent")
   })
}
    // handle join group end



    return (
        <div className="mb-3">

                <div className="title">
                <h2>Group List</h2>
                <button onClick={()=>setShow(!show)} className="bg-red-500 px-2 py-1 rounded-xl text-white">{ show? "Cencel" :"Create group" }</button>
                </div>
                 {
                    show?
                    <div className="bg-green-400 p-4 rounded-lg">
                        <input onChange={handleGroupName} type="text" placeholder="group Name" className="w-full p-2 outline-none rounded-lg"  />
                        <p className="text-red-600">{groupNameError}</p>
                        <input onChange={handleGroupIntro} type="text" placeholder="group Intro" className="w-full my-2 p-2 outline-none rounded-lg"  />
                        <p className="text-red-600">{groupIntroError}</p>
                        <button onClick={handleCreateGroup} className="bg-red-500 px-2 block mx-auto py-1 rounded-xl text-white">Create Group</button>
                    </div>
                  
                    :
                    <div>

                        {
                         groupList.map((item,i)=>{
                            return(
                                <div key={i} className="flex justify-between items-center mb-3 pb-3 border-b border-secondery">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-[60px] h-[60px] bg-orange-400 rounded-full overflow-hidden">
                                            <img className="w-full" src="" alt="" />
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-red-500 text-xl text-whi">Admin:{item.adminName}</h2>
                                            <h2 className="font-bold text-xl text-whi">{item.groupName}</h2>
                                            <p className="text-red-500">{item.groupIntro}</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <button onClick={()=>handleJoinGroup(item)} className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Join</button>
                                    </div>
    
                                </div>


                            )
                         })   
                        }

                      
                   </div>
                } 

                   
 
   </div>
    );
};

export default GroupList;