export const MainName = {
  Home: 'home',
  Detail: 'detail',
} as const

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MainName = (typeof MainName)[keyof typeof MainName]
