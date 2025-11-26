import { createSlice } from "@reduxjs/toolkit";
import { FreelancerApi } from "../api";

const initialState = {
  value: null,
};

export const userManageSlice = createSlice({
  name: "userManage",
  initialState,
  reducers: {
    addUser: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload;
    },
    removeUser: (state) => {
      state.value = null;
    },
    setUser: (state, action) => {
        state.value = action.payload;
    }
  },
});

export const getUser  = (data) => async(dispatch) =>{
    const user = await FreelancerApi.getFreelancerById(data);
    dispatch(setUser(user));
}

export const updateUser = (data) => async(dispatch) =>{
    dispatch(setUser(data));
}


// Action creators are generated for each case reducer function
export const { addUser, setUser, removeUser } = userManageSlice.actions;

export default userManageSlice.reducer;