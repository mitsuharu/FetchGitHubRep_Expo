import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Repository } from '@/api/github/Repository'
import { FetchRepositoryResult } from '@/api/github/FetchRepositoryResult'

export type RepositoryState = {
  keyword: string | null
  page: number
  total: number
  hasNext: boolean
  items: Repository[]
  error: Error | null
  isRequesting: boolean
}

const initialState: Readonly<RepositoryState> = {
  keyword: null,
  page: 1,
  total: 0,
  hasNext: true,
  items: [],
  error: null,
  isRequesting: false,
}

const slice = createSlice({
  name: 'REPOSITORY',
  initialState,
  reducers: {
    fetchRepositories(
      state,
      {
        payload: { keyword, page },
      }: PayloadAction<{ keyword: string; page?: number }>,
    ) {
      const nextPage = page ? page : state.page
      const isFirstFetch = nextPage === 1
      state = {
        ...state,
        keyword: keyword,
        page: nextPage,
        total: isFirstFetch ? 0 : state.total,
        hasNext: isFirstFetch ? true : state.hasNext,
        items: isFirstFetch ? [] : state.items,
        isRequesting: true,
        error: null,
      }
    },
    fetchRepositoriesSucceeded(
      state,
      { payload: { result } }: PayloadAction<{ result: FetchRepositoryResult }>,
    ) {
      const items = [...state.items, ...result.items]
      const hasNext = items.length < result.total
      state = {
        ...state,
        isRequesting: false,
        items: items,
        total: result.total,
        hasNext: hasNext,
        error: null,
      }
      console.log(`new sate ${state.items[0].name}`)
    },
    fetchRepositoriesFailed(
      state,
      { payload: { error } }: PayloadAction<{ error: Error }>,
    ) {
      state = {
        ...state,
        hasNext: false,
        isRequesting: false,
        error: error,
      }
    },
    fetchRepositoriesMore() {},
  },
})

export const {
  fetchRepositories,
  fetchRepositoriesSucceeded,
  fetchRepositoriesFailed,
  fetchRepositoriesMore,
} = slice.actions
export const RepositoryReducer = slice.reducer
