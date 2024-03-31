import Lottie from "lottie-react";
import login from "../../Animetion/Login.json";
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../features/counter/userSlice";






const Login = () => {

    // dicpatch start
const dispatch=useDispatch();
      // dicpatch end

    const navigate=useNavigate()
const[email,setEmail]=useState("")
const[password,setPassword]=useState("")

const[emailError,setEmailError]=useState("")
const[passwordError,setPasswordError]=useState("")

const [showPass,setShowPass]=useState(false)
const auth = getAuth();


const handleShow=()=>{
    setShowPass(!showPass)
}

const handleEmail=(e)=>{
    setEmail(e.target.value)
    setEmailError("")
}
const handlePassword=(e)=>{
    setPassword(e.target.value)
    setPasswordError("")
}

let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const handleSubmit=(event)=>{
     event.preventDefault();
     if(email==''){
        setEmailError("Enter the email")
     }

     else if (!regEmail.test(email)){
        setEmailError(" Email not valid")
    }
     else if(password==''){
    setPasswordError("Enter the Passwprd")
     }
     else{

            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
           
            // console.log(user)
               dispatch(userLoginInfo(user));
               localStorage.setItem('user',JSON.stringify(user));
                toast.success("Login successfull !");
                navigate('/home')
                
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
            if(errorCode=='auth/invalid-credential'){
                toast.error("wrong password !");
            
            }
        });
       
     }
}
 




    return (
        <div className="login">
             
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                <div className="left">
                    <form onClick={handleSubmit} action="">
                        <h2>Sign In Here</h2>
                        <input onChange={handleEmail} type="email" placeholder="Email" />
                        {
                            emailError&&
                            <p className="text-yellow-500 bg-red-600">{emailError}</p>

                        }
                        <div className="relative">
                        <input  onChange={handlePassword} type={showPass? "text" :"password"} placeholder=" Password" />
                        {
                            showPass
                            ?<IoEyeOutline  onClick={handleShow} className="absolute text-yellow-500 top-3 right-3" />
                            :<FaRegEyeSlash onClick={handleShow} className="absolute text-yellow-500 top-3 right-3" />
                        }
                        
                        

                        </div>
                       
                        {
                            passwordError&&
                            <p className="text-yellow-500 bg-red-600">{passwordError}</p>

                        }
                       
                        <button type="submit">Login</button>
                        <p className="">If you  Register mamber please <Link className="text-red-700 text-xl" to='/'>Registration</Link></p>
                        <p className=""><Link className="text-red-700 text-xl" to='/forgotten'>Forgotten Password</Link></p>
                    </form>
                </div>
                <div className="right"> 
                <Lottie animationData={login} />
                </div>

            </div>
        </div>
    );
};

export default Login;