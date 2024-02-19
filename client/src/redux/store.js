import { combineReducers, configureStore } from '@reduxjs/toolkit'
import usereducer from './user/userSlice'
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const rootreducer=combineReducers({user:usereducer})
const persistconfig={
  key:"root",
  storage,
  version:1,
}
const persistreducer=persistReducer(persistconfig,rootreducer)
export const store = configureStore({
  reducer: persistreducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
    serializableCheck:false,
  }),
})
export const persistor=persistStore(store)