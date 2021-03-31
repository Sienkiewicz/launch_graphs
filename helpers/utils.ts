import { max, min } from 'd3-array'
import { AmountType } from './types'

export const fixContinuous = (arr: number[]) => {
  const acc = [] as number[]

  let i = 0
  const k = min(arr)
  i === 0 && acc.push(k)
  i = 1
  while (acc[acc.length - 1] < max(arr)) {
    acc.push(k + i)
    i++
  }
  return acc
}

export const comparison: AmountType = (amount1, amount2, width) => {
  if (width < 500) {
    return amount1
  }
  return amount2
}
