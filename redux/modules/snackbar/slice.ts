import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

export type ToastType = 'success' | 'error' | 'info'

export type SnackbarItem = {
  message: string
  createdAt: number
  type: ToastType
}

export type SnackbarState = {
  itemQueue: SnackbarItem[]
}

const initialState: Readonly<SnackbarState> = {
  itemQueue: [],
}

const slice = createSlice({
  name: 'SNACKBAR',
  initialState,
  reducers: {
    enqueueSnackbar(
      state,
      {
        payload: { message, type },
      }: PayloadAction<{ message: string; type?: ToastType }>,
    ) {
      state.itemQueue = [
        ...state.itemQueue,
        {
          message: message,
          createdAt: dayjs().valueOf(),
          type: type ?? 'info',
        },
      ]
    },

    dequeueSnackbar(
      state,
      { payload: { createdAt } }: PayloadAction<{ createdAt: number }>,
    ) {
      state.itemQueue = state.itemQueue.filter(
        (item) => item.createdAt !== createdAt,
      )
    },

    clearSnackbar(state) {
      state.itemQueue = []
    },
  },
})

export const { enqueueSnackbar, dequeueSnackbar, clearSnackbar } = slice.actions
export const snackbarReducer = slice.reducer
