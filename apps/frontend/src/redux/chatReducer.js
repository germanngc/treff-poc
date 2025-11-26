import { createSlice } from "@reduxjs/toolkit";
import { ChatApi } from "../api";
// import { FreelancerApi } from "../api";

const initialState = {
  show: false,
  currentUserId: null,
  userId: null,
  chat: null
};

export const chatReducer = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.show = !state.show;
    },
    setIdsChat: (state, action) => {
      state.currentUserId = action.payload.currentUserId;
      state.userId = action.payload.userId;
    },
    setChat: (state, action) => {
        state.chat = action.payload;
    }
  },
});

export const getChatApi  = (data) => async(dispatch) =>{
    const user = await ChatApi.getChat(data);
    dispatch(setChat(user));
}

// Action creators are generated for each case reducer function
export const { toggleChat, setIdsChat, setChat } = chatReducer.actions;

export default chatReducer.reducer;