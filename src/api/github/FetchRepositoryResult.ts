// eslint-disable-next-line max-classes-per-file
import {
  JsonProperty,
  CacheKey,
  Deserializer,
  ObjectMapper,
} from 'json-object-mapper'
import { Repository } from './Repository'

@CacheKey('FetchRepositoryResult#Items')
class ItemsDeserializer implements Deserializer {
  // eslint-disable-next-line class-methods-use-this
  deserialize = (value: string): Repository[] =>
    ObjectMapper.deserializeArray(Repository, value)
}

export class FetchRepositoryResult {
  @JsonProperty({ name: 'total_count' })
  total!: number

  @JsonProperty({ deserializer: ItemsDeserializer })
  items!: Repository[]
}
