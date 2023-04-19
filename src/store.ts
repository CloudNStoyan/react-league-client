import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./mainSlice";
import settingsReducer from "./settingsSlice";

export const store = configureStore({
  reducer: {
    mainReducer,
    settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
