import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../Component/Navbar";
import GroupList from "../Component/GroupList";
import UserList from "../Component/UserList";
import Friends from "../Component/Friends";
import FriendRequest from "../Component/FriendRequest";
import MyGroup from "../Component/MyGroup";
import BlockUser from "../Component/BlockUser";

const Home = () => {
  const data = useSelector((state) =>state.userLoginInfo.userInfo);
  const navigate = useNavigate();


  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  });

  return (
    <div>
      <Navbar></Navbar>
      <div className="main_content">

        {/* group list start */}
        <div className="item">
        <GroupList></GroupList>
        </div>
        {/* group list end */}

      

       {/* friend List start */}
       <div className="item">
            <Friends></Friends>
        </div>
       {/* friend List start */}

         {/* user_list start */}
         <div className="item"> 
            <UserList></UserList>
        </div>
       {/* user_list end */}

         {/* friend Request start */}
         <div className="item">
           <FriendRequest></FriendRequest>
        </div>
       {/* friend Request start */}

       {/* my grops start */}
       <div className="item">
       <MyGroup></MyGroup>
        </div>

        {/* my grops end*/}

        {/* Block list start */}
        <div className="item">
           <BlockUser></BlockUser> 
        </div>
        {/* Block list end */}
 
      </div>
    </div>
  );
};

export default Home;
