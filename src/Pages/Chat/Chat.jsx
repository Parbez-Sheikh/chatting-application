import Chatting from "../../Component/Chatting";
import Friends from "../../Component/Friends";
import MsgGroup from "../../Component/MsgGroup";
import Navbar from "../../Component/Navbar";


const Chat = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className="flex container mx-auto justify-between ">
                <div className=" w-[35%] ">
                    <div className="border-2 border-red-700 rounded-lg p-4 mt-3">
                        <Friends></Friends>
                    </div>
                    <div className="border-2 border-red-700 rounded-lg p-4 mt-3">
                        <MsgGroup></MsgGroup>
                    </div>
                </div>
                <div className=" w-[50%]">
                    <Chatting></Chatting>
                </div>

            </div>
        </div>
    );
};

export default Chat;