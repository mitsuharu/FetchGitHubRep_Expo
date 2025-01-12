import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { fetchRepositories } from '@/api'
import { Repository } from '@/api/github/Repository'

export const useSearchRepository = (keyword: string) => {
  const [items, setItems] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasNext, setHasNext] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  const fetcher = useCallback(async () => {
    try {
      const result = await fetchRepositories({ keyword, page })
      return result
    } catch (e) {
      console.log(`useSearchRepository#fetcher e:${e}`)
      throw e
    }
  }, [keyword, page])

  const key = useMemo(
    () => `search/repository?q=${keyword}&page=${page}`,
    [keyword, page],
  )

  const { data, error } = useSWR(key, fetcher)

  const loadMore = useCallback(() => {
    if (hasNext && !isLoading) {
      setPage(page + 1)
    }
  }, [hasNext, isLoading, page])

  useEffect(() => {
    setItems([])
    setTotal(0)
    setHasNext(true)
    setPage(1)
  }, [keyword])

  useEffect(() => {
    setIsLoading(!error && !data)
  }, [data, error])

  useEffect(() => {
    if (data && data.items !== undefined && data.total !== undefined) {
      const nextItems = [...items, ...data.items]
      setTotal(data.total)
      setItems(nextItems)
      setHasNext(nextItems.length < data.total)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return {
    items,
    isLoading,
    error,
    total,
    loadMore,
  }
}
