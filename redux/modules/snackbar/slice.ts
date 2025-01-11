import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

export type SnackbarType = 'success' | 'error' | 'info'

export type SnackbarItem = {
  message: string
  createdAt: number
  type: SnackbarType
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
      }: PayloadAction<{ message: string; type?: SnackbarType }>,
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
      {
        payload: { createdAt },
      }: PayloadAction<{
        createdAt: number
      }>,
    ) {
      state.itemQueue = state.itemQueue.filter(
        (item) => item.createdAt !== createdAt,
      )
    },

    clearSnackbar(state) {
      state.itemQueue = []
    },

    _onHideSnackbar(
      state,
      payloadAction: PayloadAction<{ createdAt: number }>,
    ) {},
  },
})

export const {
  enqueueSnackbar,
  dequeueSnackbar,
  clearSnackbar,
  _onHideSnackbar,
} = slice.actions
export const snackbarReducer = slice.reducer
