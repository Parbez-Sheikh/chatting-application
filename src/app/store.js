import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../features/counter/userSlice'
import activeChatSlice from '../features/counter/activeChatSlice'



export default configureStore({
  reducer: {
    
    userLoginInfo: userSlice ,
    activeChatSlice: activeChatSlice,

  },
})