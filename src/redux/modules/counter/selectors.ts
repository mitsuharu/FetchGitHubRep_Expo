import { RootState } from '@/redux'

export const selectCount = (state: RootState): number => state.counter.count
