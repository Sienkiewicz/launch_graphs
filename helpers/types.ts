export type DataType = ChainType[]

type ChainType = {
  launch_year: string
  rocket: {
    rocket_name: string
  }
  launch_site: {
    site_name: string
  }
}

export type PureDataChainType = {
  [key: string]: number
  total: number
  year: number
}

export type DataLocationChainType = {
  data: string
  value: number
}

export type BarStateType = {
  years: number[]
  keys: string[]
  pourData: PureDataChainType[]
}

export type AmountType = <T>(amount1: T, amount2: T, width: number) => T
