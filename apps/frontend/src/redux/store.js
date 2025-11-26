import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import serviceReducer from "./serviceReducer";
//persist
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import chatReducer from "./chatReducer";
import notificationReducer from "./notificationReducer";

const persistConfig = {
  key: "user",
  storage,
};
const reducers = combineReducers({
  user: userReducer,
  service: serviceReducer,
  chat: chatReducer,
  notification: notificationReducer
});
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
