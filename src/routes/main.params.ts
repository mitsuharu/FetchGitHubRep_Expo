import { Repository } from '@/api/github/Repository'

export type MainParams = {
  Home: undefined
  Detail: { repository: Repository }
}
