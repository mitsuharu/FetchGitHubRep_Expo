import { all, fork } from 'redux-saga/effects'

export function* rootSaga() {
  console.log('rootSaga start')
  // yield all([
  //   fork(inAppBrowserSaga),
  //   fork(printerSaga),
  //   fork(nfcSaga),
  //   fork(asciiArtSaga),
  // ])
}
