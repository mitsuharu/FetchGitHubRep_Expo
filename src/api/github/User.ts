import { JsonProperty } from 'json-object-mapper'

export class User {
  @JsonProperty()
  id!: number

  @JsonProperty({ name: 'login' })
  name!: string

  @JsonProperty({ name: 'avatar_url' })
  avatarUrl!: string

  @JsonProperty({ name: 'html_url' })
  url!: string

  static dummy(id?: number): User {
    const temp = new User()
    temp.id = id ?? 1234
    temp.name = 'dummy-name'
    temp.avatarUrl = 'https://httpbin.org/image/png'
    temp.url = 'https://github.com/'
    return temp
  }
}
