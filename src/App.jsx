import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import firebaseConfig from "./firebase.congig";
import Registration from "./Pages/Registration/Registration";
import Login from "./Pages/Registration/Login";
import Home from "./Home/Home";
import ForgottenPassword from "./ForgotPassword/ForgottenPassword";
import Chat from "./Pages/Chat/Chat";


function App() {

  const router=createBrowserRouter([
    {
      path:'/',
      element:<Registration></Registration>,
    },
    
    {
      path:'/login',
      element:<Login></Login>,
    },
    {
      path:'/home',
      element:<Home></Home>,
    },
    {
      path:'/chat',
      element:<Chat></Chat>

    },
    {
      path:'/forgotten',
      element:<ForgottenPassword></ForgottenPassword>,
    },
  ])

  return (
    <>
    <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
