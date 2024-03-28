import ModalImage from "react-modal-image";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoCamera } from "react-icons/io5";
import { AiOutlineAudio } from "react-icons/ai";
import { GrGallery } from "react-icons/gr";
import { useSelector } from 'react-redux'
import { useState } from "react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect } from "react";
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const img='https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg'
const imgUrl='https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D'



const Chatting = () => {
const activeChatClice=useSelector((state)=>state.activeChatSlice)
const data=useSelector((state)=>state.userLoginInfo.userInfo)
const db=getDatabase();
const[message,setMessage]=useState('')
const[messageList,setMessageList]=useState([])
const storage = getStorage();

// console.log(messageList)
//  console.log(activeChatClice.active.id)

// handle message send start

const handleMessageSend=()=>{


   if(activeChatClice.active.status=="single"){
    set(push(ref(db,'singleMessage')),{
        whoSendId:data.uid,
        whoSendName:data.displayName,
        whoReceiveId:activeChatClice.active.id,
        whoReceiveName:activeChatClice.active.name,
        msg:message,
        date:`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()},${new Date().getHours()%12 || 12}:
        ${new Date().getMinutes()} ${new Date().getHours()>=12 ?"PM" : "AM"}`,
    }).then(()=>{
        console.log("gese")
       

    }).catch((error)=>{
        console.log("jai nai")
    })
    setMessage("")
   }
   else{
    console.log("group")
   }
}
// handle message send end

useEffect(()=>{

onValue(ref(db,'singleMessage'),(snapshot)=>{
    let arr=[];
    snapshot.forEach((item)=>{

       if(item.val().whoSendId==data.uid && item.val().whoReceiveId==activeChatClice.active.id || item.val().whoReceiveId==data.uid && item.val().whoSendId==activeChatClice.active.id){
        arr.push(item.val())
       }

    })

    setMessageList(arr)
})

},[activeChatClice.active.id])


// image Upload start
const handleImgUpload=(e)=>{

    // console.log(e.target.files[0].name)


const storageRef = sref(storage, e.target.files[0].name );
const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);


uploadTask.on('state_changed', 
  (snapshot) => {

    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
  
  }, 
  (error) => {
    // Handle unsuccessful uploads
    console.log(error)
  }, 
  () => {
  
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //   console.log('File available at', downloadURL);
    set(push(ref(db,'singleMessage')),{
        whoSendId:data.uid,
        whoSendName:data.displayName,
        whoReceiveId:activeChatClice.active.id,
        whoReceiveName:activeChatClice.active.name,
        img:downloadURL,
        date:`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()},${new Date().getHours()%12 || 12}:
        ${new Date().getMinutes()} ${new Date().getHours()>=12 ?"PM" : "AM"}`,
    })


    });
  }
);


}
// image Upload start


    return (
       
         <div className="relative h-[580px] w-[550px] overflow-y-scroll rounded-lg mt-3  border-2 border-red-500 px-6">
            {/* Identity start */}
            <div className="sticky py-3 top-0 left-0 flex gap-5 items-center bg-white border-b mb-4 border-r-slate-600">
                <div className="w-[60px] h-[60px] rounded-full bg-yellow-300 overflow-hidden">
                    <img src="" alt="" />
                </div>
                <div>
                    <h2 className="text-xl capitalize font-bold text-gray-800">{activeChatClice.active?.name}</h2>
                    <p>Online</p>
                </div>
            </div>
         {/* Identity start */}

         {
                activeChatClice.active.status=="single"
                ?
                
                messageList.map((item,i)=>{
                    return(
                        item.whoSendId==data.uid
                        ?
                        (
                            item.msg
                            ?
                              <div key={i} className="text-right my-3">
                                <div className="inline-block px-3 py-2 rounded-xl bg-slate-900">
                                <p className="text-white text-left">{item.msg}</p>
                                </div>
                                <p className="px-3 text-slate-400">{item.date}</p>
                                </div>

                            :

                            <div className="text-right my-3">
                            <div className="inline-block px-3 py-2 rounded-xl bg-slate-900">
                            <ModalImage
                            className="h-[200px] rounded-lg"
                            small={item.img}
                            large={item.img}
                            alt="image"
                            /> 
                            </div>
                            <p className="px-3 text-slate-400">{item.date}</p>
                            </div>

                        )

                      
            
                        :

                        
                            (
                                item.msg?

                                <div key={i} className="text-left">
                                <div className="inline-block px-3 py-2 rounded-xl bg-slate-300">
                                    <p>{item.msg}</p>
                                </div>
                                <p className="px-3 text-slate-400">{item.date}</p>
                                </div>


                                :

                                <div className="text-left">
                                <div className="inline-block px-2 py-1 rounded-xl bg-slate-300">
                                
                                    <ModalImage
                                    className="h-[200px] rounded-lg"
                                    small={item.img}
                                    large={item.img}
                                    alt="image"
                                     /> 
                                </div>
                                <p className="px-3 text-slate-400">{item.date}</p>
                             </div>



                            )

                        
                        


                    )
                })
            
                :

                <div>Group</div>
              
         }





         {/* Receive messege start */}
        
         {/* Receive messege end */}

         




          {/* Receive img start */}
          {/* <div className="text-left">
            <div className="inline-block px-2 py-1 rounded-xl bg-slate-300">
            
                <ModalImage
                className="h-[200px] rounded-lg"
                small={img}
                large={img}
                alt={img}
                 /> 
            </div>
            <p className="px-3 text-slate-400">12:34</p>
         </div> */}
            {/* Receive img end */}

            {/* Send img start */}
            {/* <div className="text-right my-3">
            <div className="inline-block px-3 py-2 rounded-xl bg-slate-900">
            <ModalImage
            className="h-[200px] rounded-lg"
             small={imgUrl}
            large={imgUrl}
            alt={imgUrl}
            /> 
            </div>
            <p className="px-3 text-slate-400">12:34</p>
            </div> */}
            {/* Send img end */}

             {/* Receive Audio start */}
         {/* <div className="text-left">
            <div className="inline-block px-3 py-2 rounded-xl bg-slate-300">
               <audio controls></audio>
            </div>
            <p className="px-3 text-slate-400">12:34</p>
         </div> */}
         {/* Receive Audio end */}

         {/* Send Audio start */}
         {/* <div className="text-right my-3">
            <div className="inline-block px-3 py-2 rounded-xl bg-slate-900">
            <audio controls></audio>
            </div>
            <p className="px-3 text-slate-400">12:34</p>
         </div> */}
         {/* Send Audio end */}

         
             {/* Receive vedio start */}
             {/* <div className="text-left">
            <div className="inline-block px-3 py-2 rounded-xl bg-slate-300">
               <video controls></video>
            </div>
            <p className="px-3 text-slate-400">12:34</p>
         </div> */}
         {/* Receive vedio end */}

         {/* Send vedio start */}
         {/* <div className="text-right my-3">
            <div className="inline-block px-3 py-2 rounded-xl bg-slate-900">
            <video controls></video>
            </div>
            <p className="px-3 text-slate-400">12:34</p>
         </div> */}
         {/* Send vedio end */}


         {/* **************** */}

         <div className="w-full  px-2 bg-slate-300 flex items-center justify-between sticky left-0 bottom-0">
            <div className="w-[85%]   rounded-lg py-2 items-center flex justify-between">
                <div className="w-[80%]">
                    <input value={message} onChange={(e)=>setMessage(e.target.value)} className="input py-1 border block w-full border-gray-900 outline-none rounded-lg " type="text" placeholder="Type a message" />
                </div>
                <div className="w-[20%] flex items-center mr-3">
                <button className=" pl-2"><MdOutlineEmojiEmotions className="text-2xl" /></button>
                <button className=" pl-2"><AiOutlineAudio className="text-2xl" /></button>
                <label>
                    <input onChange={handleImgUpload} type="file" className="hidden" />
                    <GrGallery className="text-2xl" />
                </label>
               
                </div>

            </div>
            <div className="w-[10%]">
                <button onClick={handleMessageSend} className="bg-orange-400 rounded-xl p-1">Send</button>
            </div>

         </div>
                
    
        </div>
       
     
       


       
    );
};

export default Chatting;
