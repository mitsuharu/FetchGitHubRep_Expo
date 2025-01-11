import { takeLeading } from 'redux-saga/effects'
import {
  fetchRepositories,
  fetchRepositoriesMore,
} from '@/redux/modules/repository/slice'
import {
  fetchRepositoriesSaga,
  fetchRepositoriesMoreSaga,
} from './fetchRepositoriesSaga'

export function* repositorySaga() {
  yield takeLeading(fetchRepositories, fetchRepositoriesSaga)
  yield takeLeading(fetchRepositoriesMore, fetchRepositoriesMoreSaga)
}
