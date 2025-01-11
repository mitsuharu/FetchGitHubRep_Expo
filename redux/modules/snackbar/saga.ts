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
 * enqueueToast が発行されたら逐次実行する
 */
function* watchEnqueueChannelSaga() {
  const enqueueChannel: TakeableChannel<typeof enqueueSnackbar> =
    yield actionChannel(enqueueSnackbar)
  while (true) {
    // enqueueToast を受けた
    const {
      payload: { message, type },
    }: ReturnType<typeof enqueueSnackbar> = yield take(enqueueChannel)

    // toast を表示する
    yield call(showToastSaga, {
      message: message,
      type: type ?? 'info',
      createdAt: dayjs().valueOf(),
    })

    // toast が閉じるまで待つ
    const {
      payload: { createdAt },
    }: ReturnType<typeof _onHideSnackbar> = yield take(_onHideSnackbar)

    // showToastSaga と _onHideToast それぞれの createdAt を比較必要か？
    yield put(dequeueSnackbar({ createdAt: createdAt }))
  }
}

/**
 * Toast を表示する。
 * 切り出すほどのコードでは無いが、他の toast に入れ替える場合を考慮して、別関数として切り出している
 */
function* showToastSaga({ type, message, createdAt }: SnackbarItem) {
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
 * onHideChannel 宛に発行した _onHideToast を監視して、受信したら改めて発行する
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
