import { configureStore } from '@reduxjs/toolkit'
// import { useSelector } from 'react-redux'

import rootReducer from './reducers'

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: false,
    }),
})

export default store
