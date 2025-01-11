import { actionChannel, call, delay, fork, put, take } from 'redux-saga/effects'
import {
  SnackbarItem,
  dequeueSnackbar,
  enqueueSnackbar,
  _onHideSnackbar,
} from './slice'
import { TakeableChannel, channel } from 'redux-saga'
import dayjs from 'dayjs'
import Toast from 'react-native-toast-message'

const onHideChannel = channel()

export function* snackbarSaga() {
  yield fork(watchEnqueueChannelSaga)
  yield fork(watchOnHideChannelSaga)
}

/**
 * enqueueSnackbar が発行されたら逐次実行する
 */
function* watchEnqueueChannelSaga() {
  const enqueueChannel: TakeableChannel<typeof enqueueSnackbar> =
    yield actionChannel(enqueueSnackbar)
  while (true) {
    // enqueueSnackbar を受けた
    const {
      payload: { message, type },
    }: ReturnType<typeof enqueueSnackbar> = yield take(enqueueChannel)

    // Snackbar を表示する
    yield call(showSnackbarSaga, {
      message: message,
      type: type ?? 'info',
      createdAt: dayjs().valueOf(),
    })

    // Snackbar が閉じるまで待つ
    const {
      payload: { createdAt },
    }: ReturnType<typeof _onHideSnackbar> = yield take(_onHideSnackbar)
    yield put(dequeueSnackbar({ createdAt: createdAt }))
  }
}

/**
 * Snackbar を表示する
 */
function* showSnackbarSaga({ type, message, createdAt }: SnackbarItem) {
  yield call(Toast.show, {
    type: type,
    text1: message,
    onHide: () => {
      // コールバックが一般関数のため、一旦、別の chanel 宛に action を発行する
      onHideChannel.put(_onHideSnackbar({ createdAt: createdAt }))
    },
  })
}

/**
 * onHideChannel 宛に発行した _onHideSnackbar を監視して、受信したら改めて発行する
 */
function* watchOnHideChannelSaga() {
  while (true) {
    const {
      payload: { createdAt },
    }: ReturnType<typeof _onHideSnackbar> = yield take(onHideChannel)
    yield delay(500)
    yield put(_onHideSnackbar({ createdAt: createdAt }))
  }
}
