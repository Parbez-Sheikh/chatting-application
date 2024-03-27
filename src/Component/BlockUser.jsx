import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";


const BlockUser = () => {

const db=getDatabase();
const data=useSelector((state)=>state.userLoginInfo.userInfo);
const [blockList,setBlockList]=useState([]);

useEffect(()=>{

    const blockRef=ref(db,'block')
    onValue(blockRef,(snapshot)=>{
        let list=[];
        snapshot.forEach((item)=>{
            if(data.uid==item.val().blockById){
                list.push({
                    id:item.key,
                    block:item.val().block,
                    blockId:item.val().blockId
                })
            }
            else{
                list.push({
                    id:item.key,
                    blockBy:item.val().blockBy,
                    blockById:item.val().blockById
                })
            }

        })
        setBlockList(list)
    })

},[])

// handle unblock start

const handleUnblock=(item)=>{

   set(push(ref(db,'friend')),{
    senderId:item.blockId,
    senderName:item.block,
    receverId:data.uid,
    receverName:data.displayName,
   }).then(()=>{
    remove(ref(db,'block/'+item.id))
   })
}
// handle unblock end


    return (
        <div className="mb-3">

        <div className="title">
           <h2>Block User</h2>
           <BsThreeDotsVertical className="text-2xl" />
       </div>
       {
        blockList.map((item)=>{
            return(
                <div key={item.key}>
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-secondery">
                    <div className="flex gap-4 items-center">
                        <div className="w-[60px] h-[60px] bg-orange-400 rounded-full overflow-hidden">
                            {/* <img className="w-full" src="" alt="" /> */}
                            {
                                item.blockById?
                                 <ProfilePicture imgId={item.blockById}></ProfilePicture>
                                :
                                 <ProfilePicture imgId={item.blockId}></ProfilePicture>
                            }
                             
                        </div>
                        <div>
                            <h2 className="font-bold text-xl text-whi">{item.block?item.block :item.blockBy}</h2>
                            <p>Parbez@gmail.com</p>
                        </div>
                    </div>
                    
                    <div>
                        {
                            item.blockById?
                            <button className="bg-emerald-500 px-2 py-1 rounded-xl text-white">i am Blocked</button>
                            :
                            <button onClick={()=>handleUnblock(item)} className="bg-red-500 px-2 py-1 rounded-xl text-white">Unblock</button>
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

export default BlockUser;