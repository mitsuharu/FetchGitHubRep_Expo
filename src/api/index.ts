import { ObjectMapper } from 'json-object-mapper'
import { URL } from 'react-native-url-polyfill'
import { FetchRepositoryResult } from './github/FetchRepositoryResult'

type FetchRepositoriesType = (props: {
  keyword: string
  page?: number
}) => Promise<FetchRepositoryResult>

export const fetchRepositories: FetchRepositoriesType = async ({
  keyword,
  page,
}) => {
  try {
    const url = new URL('https://api.github.com/search/repositories')
    url.searchParams.set('q', keyword + ' in:name')
    url.searchParams.set('page', String(page ?? 1))
    url.searchParams.set('sort', 'stars')
    url.searchParams.set('per_page', '10')

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { accept: 'application/vnd.github.v3+json' },
    })
    const json = await res.json()

    const result: FetchRepositoryResult = ObjectMapper.deserialize(
      FetchRepositoryResult,
      json,
    )

    return result
  } catch (e: any) {
    console.warn(`fetchRepositories`, e)
    throw e
  }
}
