
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';


const MsgGroup = () => {

    const db=getDatabase();
    
    const data=useSelector((state)=>state.userLoginInfo.userInfo)


    // console.log(data)

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


     //  create group end

    //  group list start

    useEffect(()=>{

        const groupRef=ref(db,'group')
        onValue(groupRef, (snapshot) => {
            let list=[];
            snapshot.forEach((item)=>{
               
                    list.push({...item.val(), id:item.key})
                

            })

            setGroupList(list)
        })


    },[])

    //  group list end

    // handle join group start


    // handle join group end



    return (
        <div className="mb-3">

                <div className="title">
                <h2>Group List</h2>
             
                </div>
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
                <button  className="bg-emerald-500 px-2 py-1 rounded-xl text-white">Messege</button>
            </div>

        </div>


    )
 })   
}


</div>

                   
 
   </div>
    );
};

export default MsgGroup;

