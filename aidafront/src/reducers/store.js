import { configureStore, combineReducers } from '@reduxjs/toolkit'
import NavBarReducer from './navBarReducer'
import UserReducer from './userReducer'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import expireReducer from 'redux-persist-expire'

const rootReducer = combineReducers({
  navbar: NavBarReducer.reducer,
  user: UserReducer.reducer
})

const persistConfig = {
  key: 'root',
  storage,
  transforms: [expireReducer(rootReducer, { expireSeconds: 10 })]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
})

export const persistor = persistStore(store)
