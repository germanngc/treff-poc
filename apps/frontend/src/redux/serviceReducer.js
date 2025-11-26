import { createSlice } from "@reduxjs/toolkit";
import { FreelancerApi } from "../api";

const initialState = {
  new: null,
};

export const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    addNewService: (state, action) => {
      state.new = action.payload;
    },
    removeNewService: (state) => {
      state.new = null;
    },
    setUser: (state, action) => {
        state.new = action.payload;
    }
  },
});

export const getUser  = (data) => async(dispatch) =>{
    const user = await FreelancerApi.getFreelancerById(data);
    dispatch(setUser(user));
}

// Action creators are generated for each case reducer function
export const { addNewService, setUser, removeNewService } = serviceSlice.actions;

export default serviceSlice.reducer;