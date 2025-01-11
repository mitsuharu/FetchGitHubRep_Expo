import {
  CacheKey,
  Deserializer,
  JsonProperty,
  ObjectMapper,
} from 'json-object-mapper'
import { User } from './User'

@CacheKey('Repository#User')
class UserDeserializer implements Deserializer {
  // eslint-disable-next-line class-methods-use-this
  deserialize = (value: string): User => ObjectMapper.deserialize(User, value)
}

export class Repository {
  @JsonProperty()
  id!: number

  @JsonProperty()
  name!: string

  @JsonProperty({ name: 'full_name' })
  fullName!: string

  @JsonProperty({ name: 'html_url' })
  url!: string

  @JsonProperty({ required: false })
  description?: string

  @JsonProperty({ deserializer: UserDeserializer })
  owner!: User

  @JsonProperty({ name: 'stargazers_count' })
  stars!: number

  @JsonProperty({ name: 'watchers_count' })
  watchers!: number

  @JsonProperty()
  topics!: string[]

  static dummy(id?: number): Repository {
    const temp = new Repository()
    temp.id = id ?? 1234
    temp.name = 'dummy-name-' + String(temp.id)
    temp.fullName = 'dummy-full-name-' + String(temp.id)
    temp.url = 'https://example.com/'
    temp.description = 'dummy-description-' + String(temp.id)
    temp.owner = User.dummy()
    temp.stars = 1000
    temp.watchers = 500
    temp.topics = [
      'dummy-topic-0',
      'dummy-topic-1',
      'dummy-topic-2',
      'dummy-topic-3',
      'dummy-topic-4',
    ]
    return temp
  }

  static dummyList(length: number): Repository[] {
    return [...Array(length)]
      .map((_, i) => i)
      .map<Repository>((i) => Repository.dummy(i))
  }
}
