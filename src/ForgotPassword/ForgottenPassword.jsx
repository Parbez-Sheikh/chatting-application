import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from 'react-toastify';



const ForgottenPassword = () => {
    const auth = getAuth();

    const[email,setEmail]=useState("")
    const[emailError,setEmailError]=useState("")

    const handleEmail=(e)=>{
        setEmail(e.target.value)
        setEmailError("")
    }

    const handleSubmit=(event)=>{
        event.preventDefault()
        if(email==''){
            setEmailError("Enter the email")
        }
        else{
            sendPasswordResetEmail(auth, email)
            .then(() => {
              // Password reset email sent!
              toast.success("Send mail !");
              // ..
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
             
              if(errorCode=='auth/invalid-email'){

                 toast.error("user not found !");
              }
              // ..
            });
        }
    }



    return (
        <div id="forgot" className="bg-slate-900 h-screen flex justify-center items-center ">
            <form onSubmit={handleSubmit} className="bg-slate-50 w-[25%]  px-4 py-3">
            <h2 className="text-red-600 text-2xl my-2 font-bold">Forgot Password</h2>
            <input onChange={handleEmail} type="text" placeholder="Email" />
            <p className="text-red-600 px-1">{emailError}</p>
            <button type="submit">Send</button>
            <button><Link to='/login'>Login Back</Link></button>
            </form>
        </div>
    );
};

export default ForgottenPassword;