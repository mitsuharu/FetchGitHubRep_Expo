import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type CounterState = {
  count: number
}

const initialState: Readonly<CounterState> = {
  count: 0,
}

const slice = createSlice({
  name: 'COUNTER',
  initialState,
  reducers: {
    increaseCount(state) {
      state.count = state.count + 1
    },
    decreaseCount(state) {
      state.count = state.count - 1
    },
    assignCount(
      state,
      { payload: { count } }: PayloadAction<{ count: number }>,
    ) {
      state.count = count
    },
    clearCount(state) {
      state.count = 0
    },
  },
})

export const { increaseCount, decreaseCount, assignCount, clearCount } =
  slice.actions
export const CounterReducer = slice.reducer
