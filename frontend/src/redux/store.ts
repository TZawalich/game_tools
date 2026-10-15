import { configureStore } from '@reduxjs/toolkit';
import boardReducer from "../char_cards/board/boardSlice"

export const store = configureStore({
  reducer: {
      board: boardReducer,
  }
})

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
