import { all, fork } from 'redux-saga/effects'
import { snackbarSaga } from './modules/snackbar/saga'
import { repositorySaga } from './modules/repository/saga'

export function* rootSaga() {
  console.log('rootSaga start')
  yield all([fork(snackbarSaga), fork(repositorySaga)])
}
