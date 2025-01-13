import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'
import { snackbarReducer } from './modules/snackbar/slice'
import { CounterReducer } from './modules/counter/slice'
import { rootSaga } from './saga'

const initializeStore = () => {
  console.log(`initializeStore`)
  const sagaMiddleware = createSagaMiddleware({
    onError: (error: Error, errorInfo: any) => {
      console.error('sagaMiddleware', error, errorInfo)
    },
  })

  const store = configureStore({
    reducer: {
      counter: CounterReducer,
      snackbar: snackbarReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(sagaMiddleware),
    devTools: true,
  })

  sagaMiddleware.run(rootSaga)

  return store
}

export const store = initializeStore()
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
