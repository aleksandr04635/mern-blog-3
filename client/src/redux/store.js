import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import themeReducer from "./theme/themeSlice";
import pageSizeReducer from "./pageSize/pageSizeSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "./apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  pageSize: pageSizeReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

//https://github.com/rt2zz/redux-persist?tab=readme-ov-file#blacklist--whitelist
const persistConfig = {
  key: "root",
  storage,
  version: 1,
  blacklist: ["api"],
};
//persists the state without api in a local storage
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware
    ),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
