import { all, fork } from 'redux-saga/effects'
import { snackbarSaga } from './modules/snackbar/saga'

export function* rootSaga() {
  console.log('rootSaga start')
  yield all([fork(snackbarSaga)])
}
