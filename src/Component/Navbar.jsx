import { TiHomeOutline } from "react-icons/ti";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io"
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { userLoginInfo } from "../features/counter/userSlice";
import { FaCloudDownloadAlt } from "react-icons/fa";
import {  useState } from "react";
import  {  createRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";




// ....




const Navbar = () => {
    const auth = getAuth();
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const storage=getStorage()
   

  
    // react cropper start.....

    const [image, setImage] = useState("");
    const [cropData, setCropData] = useState("#");
    const cropperRef = createRef();


    // react cropper end......

    const data=useSelector((state)=>state.userLoginInfo.userInfo)

    const handleLogut=()=>{
        signOut(auth).then(() => {
            // Sign-out successful.
            dispatch(userLoginInfo(null))
            localStorage.removeItem('user');
            navigate('/login')
          }).catch((error) => {
            // An error happened.
          });
    }

    const[showModal,setShowModal]=useState(false)

    const handleModal=()=>{
        setShowModal(!showModal)
    }
    const clossModal=()=>{
        setShowModal(false)
    }

      // react cropper start.....
      const handleProfilePicture = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
  
        const reader = new FileReader();
        reader.onload = () => {
        setImage(reader.result);
       
        };
        reader.readAsDataURL(files[0]);

      };

      const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
          setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
          const storageRef = ref(storage, auth.currentUser.uid);
          const message4 =cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
          uploadString(storageRef, message4, 'data_url').then((snapshot) => {
            // console.log('Uploaded a data_url string!');
            // ......download data viw URL.....
            getDownloadURL(storageRef).then((downloadURL) => {

              updateProfile(auth.currentUser, {
                photoURL:downloadURL
              })
            // ........
            dispatch(userLoginInfo({...data,photoURL:downloadURL}))
            localStorage.setItem("user",JSON.stringify({...data,photoURL:downloadURL}))
            setShowModal(false)
            });
        });
       }
      };
     
  
  
      // react cropper end......

    return (
        <nav className="bg-gray-900 py-2   ">
            <div className="container mx-auto flex items-center justify-between">
                <div className="profileAndName">

                    <div className="img relative group">
                        <img src={data.photoURL} className="w-full" alt="profile_picture" />
                        {/* <h2 className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] group-hover:hidden">{data?.displayName[0]}</h2> */}
                        <div onClick={handleModal} className="overlay hidden group-hover:block">
                        <FaCloudDownloadAlt />
                         </div>
                    </div>

                 


                    <h2 className="text-white">{data?.displayName}</h2>
                </div>
                <div className="menu_items">
                <Link to='/home'><TiHomeOutline /></Link>
                <Link to='/chat'><IoChatbubbleEllipsesOutline /></Link>
                <Link to='/notification'><IoIosNotificationsOutline /></Link>
                <div  className="cursor-pointer"><IoIosLogOut onClick={handleLogut} /></div>

                </div>
            </div> 


           {/* modal start */}

           {
            showModal&&
            <div className="modal">
            <div className="profileImage">
                <h2>Update profile picture</h2>
                <input onChange={handleProfilePicture} type="file" className="block mt-4" />
               


                {
                    image&&
                <div>
                    <div className=" h-[130px] w-[130px] bg-slate-500 overflow-hidden mx-auto rounded-full">
                    
                       <div className="img-preview h-full w-full"/>
                    </div>

                    <Cropper
                    ref={cropperRef}
                    style={{ height: 400, width: "100%" }}
                    zoomTo={0.5}
                    initialAspectRatio={1}
                    preview=".img-preview"
                    src={image}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                    guides={true}
                />
                </div>
                    
                }


                



                <div>
                <button onClick={getCropData} className="px-[30px] my-3 bg-white py-2 rounded-lg text-black mx-2">Upload</button>
                <button onClick={clossModal} className="px-[30px] my-3 bg-white py-2 rounded-lg text-black mx-2">Remove</button>
                </div>
                
             </div>

            </div>
           }
           
            {/* modal end */}


        </nav>
    );
};

export default Navbar;