
import {ref, getDownloadURL, getStorage } from "firebase/storage";
import { useEffect, useState } from "react";


const ProfilePicture = ({imgId}) => {

    let [profilePicture,setProfilePicture]=useState('')
    // console.log(profilePicture)


    const storage=getStorage();
    const pictureRef=ref(storage,imgId)

    useEffect(()=>{
        getDownloadURL(pictureRef)
        .then((url)=>{
            setProfilePicture(url)
        })
        .catch((error)=>{
            console.log(error)
        })

    },[])

    return (
        <div>
            <img src={profilePicture} alt="" />
        </div>
    );
};

export default ProfilePicture;