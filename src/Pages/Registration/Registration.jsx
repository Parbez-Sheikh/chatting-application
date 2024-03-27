import Lottie from "lottie-react";
import registration from "../../Animetion/Registration.json";
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ThreeDots } from 'react-loader-spinner'
import { updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";





const Registration = () => {

    const[name,setName]=useState("")
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[rePassword,setRePassword]=useState("")



    const[showPass,setShowPass]=useState(false)
    const handleShowPassword=()=>{
        setShowPass(!showPass)
    }


    const navigate=useNavigate()
    const auth = getAuth();
    const db= getDatabase();

    const handleName=(e)=>{
        setName(e.target.value)
        setErrorName("")
    }
    const handleEmail=(e)=>{
        setEmail(e.target.value)
        setErrorEmail("")

    }
    const handlePassword=(e)=>{
        setPassword(e.target.value)
        setErrorPassword("")

    }
    const handleRePassword=(e)=>{
        setRePassword(e.target.value)

    }

    const[errorName,setErrorName]=useState("")
    const[errorEmail,setErrorEmail]=useState("")
    const[errorPassword,setErrorPassword]=useState("")
    const[errorRePassword,setErrorRePassword]=useState("")

// regez name / email
    const regName = /^[a-zA-Z ]{2,40}$/;
    const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// regez name / email


const [loader,setLoader]=useState(false)






    const handleOnsubmit=(event)=>{
        event.preventDefault()

        if(name==''){
            setErrorName("Enter the FullName")
        }

        else if (!regName.test(name)){
            setErrorName(" Name not valid")
        }

        else if(email==''){
            setErrorEmail("Enter the Email")
        }
        else if (!regEmail.test(email)){
            setErrorEmail(" Email not valid")
        }
        
        
        else if(password==''){
            setErrorPassword("Enter the Password")
        }

        else if(rePassword==''){
            setErrorRePassword("Enter the RePassword")
        }
        else if(rePassword!== password){
            setErrorRePassword("Password not match")
        }
        
        else{
            setLoader(true)
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                     // Signed up 
                    // updateProfile start
                    updateProfile(auth.currentUser, {
                        displayName:name,
                        photoURL: "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                      })
                      .then(() => {
                        const user = userCredential.user;
                        toast.success("Registration Successfull !");
                        setLoader(false)
                        navigate('/login')
                        // Profile updated!
                        // ...
                      })
                      .then(()=>{
                        set(ref(db, 'users/'+auth.currentUser.uid ), {
                            username: name,
                            email: email,
                         
                          });
                        
                      })
                      
                      .catch((error) => {
                        // An error occurred
                        console.log(error)
                        // ...
                      });
                       // updateProfile end
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    if(errorCode=='auth/email-already-in-use'){
                        toast.error("email-already-in-use !");
                        setLoader(false)
                    }
                   
                    // ..
                });
           
        }

    }


    return (
        <div className="registration">
             
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                <div className="left">
                   
                    <form onSubmit={handleOnsubmit} >
                    <h2>Sign Up Here</h2>
                        <input   onChange={handleName}  type="text" placeholder="Full Name" />
                        {
                          errorName&&  
                        <p className="bg-[red] py-1 text-[yellow] px-2">{errorName}</p>
                        }
                       
                        <input  onChange={handleEmail}  type="text" placeholder="Email" />
                        {
                          errorEmail&&  
                          <p className="bg-[red] py-1 text-[yellow] px-2">{errorEmail}</p>
                        }
                      
                        <div className="relative">
                        <input onChange={handlePassword}  type={showPass?"text" :"password"}  placeholder="PassWord" />
                        {
                            showPass
                            ?<MdOutlineRemoveRedEye onClick={handleShowPassword} className="absolute top-3 right-4" />
                            : <FaRegEyeSlash onClick={handleShowPassword} className="absolute top-3 right-4" />
                        }
                        </div>
                        {
                          errorPassword&& 
                          <p className="bg-[red] py-1 text-[yellow] px-2">{errorPassword}</p> 
                        }
                       

                        <div className="relative">
                        <input onChange={handleRePassword}  type={showPass?"text" :"password"} placeholder="RePassWord" />
                        {
                            showPass
                            ?<MdOutlineRemoveRedEye onClick={handleShowPassword} className="absolute  top-3 right-4" />
                            : <FaRegEyeSlash onClick={handleShowPassword} className="absolute  top-3 right-4" />
                        }

                        </div>
                        {
                            errorRePassword&&
                            <p className="bg-[red] py-1 text-[yellow] px-2">{errorRePassword}</p>
                        }
                      
                       
                        {
                            loader
                            ?  <div className="w-[20%] mx-auto text-center"><ThreeDots color="#3dc1d3" /></div>
                            :<button type="submit">Registration</button>
                        }

                        <div>
                            <p>Already have an account ?<Link className="text-red-600 text-xl" to="/login">Login</Link></p>
                        </div>
                         
                    </form>
                </div>
                <div className="right">
                <Lottie animationData={registration} />
                </div>


            </div>
        </div>
    );
};

export default Registration;