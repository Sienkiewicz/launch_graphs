import { fsum, max, rollup } from 'd3-array'
import { useEffect, useState } from 'react'
import { DataLocationChainType, DataType, PureDataChainType } from '../types'
import { fixContinuous } from '../utils'

export const useLaunchData = (data: DataType) => {
  const [years, setYears] = useState<number[]>()
  const [keys, setKeys] = useState<string[]>()
  const [pourData, setPourDate] = useState<PureDataChainType[]>()
  const [lastYear, setLastYear] = useState<number>()

  useEffect(() => {
    const convertData = rollup(
      data,
      v => v.length,
      d => d.launch_year,
      d => d.rocket.rocket_name
    )

    const years = fixContinuous(Array.from(convertData.keys()).map(k => +k))
    const lastYear = max(years)
    const setOfKeys: Set<string> = new Set()
    convertData.forEach(r =>
      Array.from(r.keys()).forEach(key => setOfKeys.add(key))
    )

    const keys = Array.from(setOfKeys)

    let pourData = [] as PureDataChainType[]

    years.forEach(year => {
      if (convertData.get(year.toString()) === undefined) return
      let item = Object.fromEntries(convertData.get(year.toString()))

      setOfKeys.forEach((key: string) => {
        if (!item[key]) item[key] = 0
      })

      pourData.push({
        year,
        ...item,
        total: fsum(Object.values(item)),
      })
    })
    setYears(years)
    setKeys(keys)
    setPourDate(pourData)
    setLastYear(lastYear)
  }, [data])

  return { years, keys, pourData, lastYear }
}

export const useLocationData = (data: DataType) => {
  const [pieState, setPieState] = useState<DataLocationChainType[]>()
  const [lastYear, setLastYear] = useState<string>()
  useEffect(() => {
    const launchData = Object.fromEntries(
      rollup(
        data,
        v => v.length,
        d => d.launch_site.site_name
      )
    )

    const lastYear = max(data.map(t => t.launch_year))

    const launchLocations = Object.keys(launchData)
    const dataLocations: DataLocationChainType[] = launchLocations.map(t => {
      return {
        data: t,
        value: launchData[t],
      }
    })

    setPieState(dataLocations)
    setLastYear(lastYear)
  }, [data])
  return { pieState, lastYear }
}
