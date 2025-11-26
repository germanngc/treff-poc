import { createSlice } from "@reduxjs/toolkit";
import { ChatApi } from "../api";
// import { FreelancerApi } from "../api";

const initialState = {
  show: false,
  notifications: [],
  lastNotifications: [],
};

export const notificationReducer = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const data = Array.isArray(state.notifications) ? [...state.notifications] : [];
      data.unshift(action.payload);
      state.notifications = data;
    },
    addNotifications: (state, action) => {
      const data = [];

      action.payload.forEach(notification => {
        if(data.filter(d => d.id === notification.id).length === 0){
          data.push(notification);
        }
      });
      
      state.notifications = data;
    },
    readNotifications: (state) => {
      state.notifications = [];
    },
    addLastNotifications: (state, action) => {
      const data = Array.isArray(state.lastNotifications) ? [...state.lastNotifications] : [];
      action.payload.forEach(notification => {
        if(data.filter(d => d.id === notification.id).length === 0){
          data.push(notification);
        }
      });
      
      state.lastNotifications = data;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addNotification, addNotifications, readNotifications, addLastNotifications } = notificationReducer.actions;

export default notificationReducer.reducer;
