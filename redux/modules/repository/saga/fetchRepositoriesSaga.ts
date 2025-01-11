import {
  fetchRepositories,
  fetchRepositoriesSucceeded,
  fetchRepositoriesFailed,
} from '@/redux/modules/repository/slice'
import { fetchRepositories as fetch } from '@/api'
import { call, delay, put, select } from 'redux-saga/effects'
import { FetchRepositoryResult } from '@/api/github/FetchRepositoryResult'
import {
  selectRepositoryHasNext,
  selectRepositoryIsRequesting,
  selectRepositoryKeyword,
  selectRepositoryPage,
} from '../selectors'
import { enqueueSnackbar } from '@/redux/modules/snackbar/slice'

export function* fetchRepositoriesSaga({
  payload: { keyword, page },
}: ReturnType<typeof fetchRepositories>) {
  try {
    const hasNext: boolean = yield select(selectRepositoryHasNext)
    if (!hasNext) {
      return
    }
    const result: FetchRepositoryResult = yield call(fetch, { keyword, page })

    console.log(`result: ${result}`)

    yield put(fetchRepositoriesSucceeded({ result }))
  } catch (e: any) {
    console.warn(`fetchRepositoriesSaga`, e)
    if (e instanceof Error) {
      yield put(fetchRepositoriesFailed({ error: e }))
      yield put(enqueueSnackbar({ message: e.message }))
    }
  }
}

export function* fetchRepositoriesMoreSaga() {
  const isRequesting: boolean = yield select(selectRepositoryIsRequesting)
  if (isRequesting) {
    return
  }
  yield delay(500)
  const keyword: string = yield select(selectRepositoryKeyword)
  const page: number = yield select(selectRepositoryPage)
  if (keyword) {
    yield put(
      fetchRepositories({
        keyword,
        page: page + 1,
      }),
    )
  }
}
